import { ObjectCreateDto, ObjectEditDto } from '@/dtos/object.dto'
import { prisma } from '@/lib/prisma'
import { deleteFile, uploadFile } from '@/lib/s3'
import { ApiError } from '@/utils/api-error'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import sharp from 'sharp'
import slugify from 'slugify'

class ObjectService {
	async getAll() {
		return await prisma.object.findMany()
	}

	async getById(id: number) {
		return await prisma.object.findUnique({ where: { id } })
	}

	async getBySlug(slug: string) {
		return await prisma.object.findUnique({ where: { slug } })
	}

	async create(
		info: ObjectCreateDto | undefined,
		images:
			| {
					[fieldname: string]: Express.Multer.File[]
			  }
			| Express.Multer.File[]
	) {
		const dto = plainToInstance(ObjectCreateDto, info ?? {})

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

		const slug = await this.generateUniqueSlug(info.name, info.locale)

		return await prisma.object.create({
			data: {
				images: savedImages,
				name: info.name,
				description: info.description,
				city: info.city,
				address: info.address,
				locale: info.locale || 'uk',
				slug
			}
		})
	}

	async edit(
		id: number,
		info?: ObjectEditDto | undefined,
		images?:
			| {
					[fieldname: string]: Express.Multer.File[]
			  }
			| Express.Multer.File[]
	) {
		const candidate = await prisma.object.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, "Такого об'єкта не існує")

		const dto = plainToInstance(ObjectEditDto, info ?? {})

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

		return await prisma.object.update({
			where: { id },
			data: {
				images: savedImages.length ? savedImages : candidate.images,
				name: info.name,
				description: info.description,
				city: info.city,
				address: info.address
			}
		})
	}

	async delete(id: number) {
		const candidate = await prisma.object.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, "Такого об'єкта не існує")
		try {
			await Promise.all(candidate.images.map(image => deleteFile(image)))
		} catch (error) {
			console.log('Failed to delete images, continue...')
		}
		await prisma.object.delete({ where: { id } })
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

export const objectService = new ObjectService()
