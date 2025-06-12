import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/api-error'

class TextsService {
	async all() {
		return await prisma.textField.findMany()
	}

	async edit(id: number, text: string) {
		const candidate = await prisma.textField.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого текстового поля не існує')
		return await prisma.textField.update({
			where: { id },
			data: { text }
		})
	}
}

export const textsService = new TextsService()
