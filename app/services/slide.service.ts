import { SlideCreateDto } from '@/dtos/slide.dto'
import { prisma } from '@/lib/prisma'
import { deleteFile, uploadFile } from '@/lib/s3'
import { ApiError } from '@/utils/api-error'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import sharp from 'sharp'

class SlideService {
	async create(info: any, image: Express.Multer.File) {
		const dto = plainToInstance(SlideCreateDto, info)

		const errors = await validate(dto)
		if (errors.length) {
			throw new ApiError(400, Object.values(errors[0].constraints)[0])
		}

		let savedImage: string = ''

		if (image) {
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		return await prisma.slide.create({
			data: { ...dto, background: savedImage }
		})
	}

	async edit(id: number, info?: any, image?: Express.Multer.File) {
		const candidate = await prisma.slide.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого слайду не існує')

		const dto = plainToInstance(SlideCreateDto, info)

		let savedImage: string = candidate.background

		if (image) {
			try {
				await deleteFile(candidate.background)
			} catch (error) {
				console.log(
					'Failed to delete image when updating slide, continue... Error:',
					error
				)
			}
			const fileBuffer = await sharp(image.buffer).toFormat('jpg').toBuffer()
			const imageUrl = await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)
			savedImage = imageUrl
		}

		return await prisma.slide.update({
			where: { id },
			data: {
				background: savedImage,
				...dto
			}
		})
	}

	async get() {
		return await prisma.slide.findMany()
	}

	async delete(id: number) {
		const candidate = await prisma.slide.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого слайду не існує')

		try {
			await deleteFile(candidate.background)
		} catch (error) {
			console.log(
				'Failed to delete image when deleting slide, continue... Error:',
				error
			)
		}
		await prisma.slide.delete({ where: { id } })
	}
}

export const slideService = new SlideService()
