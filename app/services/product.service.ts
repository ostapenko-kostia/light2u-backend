import { ProductCreateDto, ProductEditDto } from '@/dtos/product.dto'
import { prisma } from '@/lib/prisma'
import { deleteFile, uploadFile } from '@/lib/s3'
import { ApiError } from '@/utils/api-error'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import sharp from 'sharp'
import slugify from 'slugify'

class ProductService {
	async get() {
		return await prisma.product.findMany({ include: { info: true } })
	}

	async create(
		productInfo: ProductCreateDto | undefined,
		images:
			| {
					[fieldname: string]: Express.Multer.File[]
			  }
			| Express.Multer.File[]
	) {
		const dto = plainToInstance(ProductCreateDto, productInfo ?? {})

		const errors = await validate(dto)
		if (errors.length) {
			throw new ApiError(400, Object.values(errors[0].constraints)[0])
		}

		const normalizedImages = Array.isArray(images)
			? images
			: Object.values(images).flat()

		const savedImages = await Promise.all(
			normalizedImages.map(async image => {
				const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
				return await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			})
		)

		const slug = await this.generateUniqueSlug(
			productInfo.name,
			productInfo.locale
		)

		return await prisma.product.create({
			data: {
				slug,
				images: savedImages,
				name: productInfo.name,
				price: productInfo.price,
				locale: productInfo.locale || 'uk',
				description: productInfo.description,
				categorySlug: productInfo.categorySlug,
				quantity: productInfo.quantity,
				info:
					productInfo.productInfo?.length > 0
						? {
								create: productInfo.productInfo?.map((info: any) => ({
									key: info.key,
									value: info.value
								}))
						  }
						: undefined
			}
		})
	}

	async edit(
		id: number,
		productInfo?: ProductEditDto | undefined,
		images?:
			| {
					[fieldname: string]: Express.Multer.File[]
			  }
			| Express.Multer.File[]
	) {
		const candidate = await prisma.product.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого товару не існує')

		const dto = plainToInstance(ProductEditDto, productInfo ?? {})

		const errors = await validate(dto)
		if (errors.length) {
			throw new ApiError(400, Object.values(errors[0].constraints)[0])
		}

		let savedImages: string[]

		if (images) {
			await Promise.all(candidate.images.map(i => deleteFile(i)))

			const normalizedImages = Array.isArray(images)
				? images
				: Object.values(images).flat()

			savedImages = await Promise.all(
				normalizedImages.map(async image => {
					const fileBuffer = await sharp(image.buffer)
						.toFormat('jpg')
						.toBuffer()
					return await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
				})
			)
		}

		return await prisma.product.update({
			where: { id },
			data: {
				images: savedImages.length ? savedImages : candidate.images,
				name: productInfo.name,
				price: productInfo.price,
				locale: productInfo.locale || 'uk',
				description: productInfo.description,
				categorySlug: productInfo.categorySlug,
				quantity: productInfo.quantity,
				info:
					productInfo.productInfo?.length > 0
						? {
								create: productInfo.productInfo?.map((info: any) => ({
									key: info.key,
									value: info.value
								}))
						  }
						: undefined
			}
		})
	}

	async delete(id: number) {
		const candidate = await prisma.product.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого товару не існує')
		try {
			await Promise.all(candidate.images.map(image => deleteFile(image)))
		} catch (error) {
			console.log('Failed to delete images, continue...')
		}
		await prisma.product.delete({ where: { id }, include: { info: true } })
	}

	async duplicate(id: number) {
		const candidate = await prisma.product.findUnique({
			where: { id },
			include: { info: true }
		})
		if (!candidate) throw new ApiError(404, 'Такого товару не існує')

		// Generate a new slug for the duplicated product
		const newSlug = await this.generateUniqueSlug(
			`${candidate.name} (Copy)`,
			candidate.locale
		)

		const maxOrderProduct = await prisma.product.findFirst({
			orderBy: { order: 'desc' },
			select: { order: true }
		})
		const newOrder = (maxOrderProduct?.order ?? 0) + 1

		// Create the duplicated product
		const duplicatedProduct = await prisma.product.create({
			data: {
				slug: newSlug,
				images: candidate.images,
				name: `${candidate.name} (Copy)`,
				price: candidate.price,
				locale: candidate.locale,
				description: candidate.description,
				categorySlug: candidate.categorySlug,
				quantity: candidate.quantity,
				order: newOrder,
				info:
					candidate.info.length > 0
						? {
								create: candidate.info.map(info => ({
									key: info.key,
									value: info.value
								}))
						  }
						: undefined
			},
			include: { info: true }
		})

		return duplicatedProduct
	}

	async moveUp(id: number) {
		const candidate = await prisma.product.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого товару не існує')

		const nextProduct = await prisma.product.findFirst({
			where: {
				order: { gt: candidate.order },
				categorySlug: candidate.categorySlug
			},
			orderBy: { order: 'asc' }
		})

		if (nextProduct) {
			// Swap orders
			await prisma.$transaction([
				prisma.product.update({
					where: { id: candidate.id },
					data: { order: nextProduct.order }
				}),
				prisma.product.update({
					where: { id: nextProduct.id },
					data: { order: candidate.order }
				})
			])
		}

		return await prisma.product.findUnique({
			where: { id },
			include: { info: true }
		})
	}

	async moveDown(id: number) {
		const candidate = await prisma.product.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого товару не існує')

		const prevProduct = await prisma.product.findFirst({
			where: {
				order: { lt: candidate.order },
				categorySlug: candidate.categorySlug
			},
			orderBy: { order: 'desc' }
		})

		if (prevProduct) {
			// Swap orders
			await prisma.$transaction([
				prisma.product.update({
					where: { id: candidate.id },
					data: { order: prevProduct.order }
				}),
				prisma.product.update({
					where: { id: prevProduct.id },
					data: { order: candidate.order }
				})
			])
		}

		return await prisma.product.findUnique({
			where: { id },
			include: { info: true }
		})
	}

	async generateUniqueSlug(
		title: string,
		locale: string = 'uk'
	): Promise<string> {
		const slug = slugify(title)
		const slugWithLocale = `${slug}-${locale}`
		let uniqueSlug = slugWithLocale
		let counter = 1

		while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
			uniqueSlug = `${slugWithLocale}-${counter}`
			counter++
		}

		return uniqueSlug
	}
}

export const productService = new ProductService()
