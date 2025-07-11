import { SecondLevelCategoryCreateDto } from '@/dtos/second-level-category.dto'
import { prisma } from '@/lib/prisma'
import { deleteFile, uploadFile } from '@/lib/s3'
import { ApiError } from '@/utils/api-error'
import sharp from 'sharp'
import slugify from 'slugify'

class SecondLevelCategoryService {
	async create(
		parentCategorySlug: string,
		name: SecondLevelCategoryCreateDto,
		image: Express.Multer.File
	) {
		const slug = slugify(name.uk)
		const candidate = await prisma.secondLevelCategory.findUnique({
			where: { slug: slug }
		})

		if (candidate) {
			throw new ApiError(409, `Така категорія другого рівня вже існує`)
		}

		let savedImage: string

		if (image) {
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		const cat = await prisma.secondLevelCategory.create({
			data: {
				slug: slug,
				image: savedImage,
				name: JSON.parse(JSON.stringify(name)),
				parentCategorySlug
			}
		})

		return cat
	}

	async edit(
		id: number,
		name?: Partial<SecondLevelCategoryCreateDto>,
		image?: Express.Multer.File
	) {
		const candidate = await prisma.secondLevelCategory.findUnique({
			where: { id }
		})
		if (!candidate)
			throw new ApiError(404, 'Такої категорії другого рівня не існує')

		let savedImage: string

		if (image) {
			try {
				await deleteFile(candidate.image)
			} catch (error) {
				console.log(
					'Failed to delete image when updating second level category, continue... Error:',
					error
				)
			}
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		const cat = await prisma.secondLevelCategory.update({
			where: { id },
			data: {
				image: savedImage,
				name: JSON.parse(JSON.stringify(name))
			}
		})

		return cat
	}

	async get() {
		return await prisma.secondLevelCategory.findMany()
	}

	async delete(id: number) {
		const candidate = await prisma.secondLevelCategory.findUnique({
			where: { id }
		})
		if (!candidate)
			throw new ApiError(404, 'Такої категорії другого рівня не існує')

		try {
			await deleteFile(candidate.image)
		} catch (error) {
			console.log(
				'Failed to delete image when deleting second level category, continue... Error:',
				error
			)
		}
		await prisma.secondLevelCategory.delete({ where: { id } })
	}
}

export const secondLevelCategoryService = new SecondLevelCategoryService()
