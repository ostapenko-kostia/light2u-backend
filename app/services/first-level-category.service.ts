import { FirstLevelCategoryCreateDto } from '@/dtos/first-level-category.dto'
import { prisma } from '@/lib/prisma'
import { deleteFile, uploadFile } from '@/lib/s3'
import { ApiError } from '@/utils/api-error'
import sharp from 'sharp'
import slugify from 'slugify'

class FirstLevelCategoryService {
	async create(name: FirstLevelCategoryCreateDto, image: Express.Multer.File) {
		const slug = slugify(name.uk)
		const candidate = await prisma.firstLevelCategory.findUnique({
			where: { slug: slug }
		})

		if (candidate) {
			throw new ApiError(409, `Така категорія першого рівня вже існує`)
		}

		let savedImage: string

		if (image) {
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		const cat = await prisma.firstLevelCategory.create({
			data: {
				slug: slug,
				image: savedImage,
				name: JSON.parse(JSON.stringify(name))
			}
		})

		return cat
	}

	async edit(
		id: number,
		name?: Partial<FirstLevelCategoryCreateDto>,
		image?: Express.Multer.File
	) {
		const candidate = await prisma.firstLevelCategory.findUnique({
			where: { id }
		})
		if (!candidate)
			throw new ApiError(404, 'Такої категорії першого рівня не існує')

		let savedImage: string

		if (image) {
			try {
				await deleteFile(candidate.image)
			} catch (error) {
				console.log(
					'Failed to delete image when updating first level category, continue... Error:',
					error
				)
			}
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		const cat = await prisma.firstLevelCategory.update({
			where: { id },
			data: {
				image: savedImage,
				name: JSON.parse(JSON.stringify(name))
			}
		})

		return cat
	}

	async get() {
		return await prisma.firstLevelCategory.findMany()
	}

	async delete(id: number) {
		const candidate = await prisma.firstLevelCategory.findUnique({
			where: { id }
		})
		if (!candidate)
			throw new ApiError(404, 'Такої категорії першого рівня не існує')

		try {
			await deleteFile(candidate.image)
		} catch (error) {
			console.log(
				'Failed to delete image when deleting first level category, continue... Error:',
				error
			)
		}
		await prisma.firstLevelCategory.delete({ where: { id } })
	}
}

export const firstLevelCategoryService = new FirstLevelCategoryService()
