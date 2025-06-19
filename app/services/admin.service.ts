import { AdminCreateDto, AdminDto, AdminLoginDto } from '@/dtos/admin.dto'
import { prisma } from '@/lib/prisma'
import { ApiError } from '@/utils/api-error'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'
import { tokenService } from './token.service'

class AdminService {
	async login(body: AdminLoginDto) {
		const { email, password } = body

		// check if admin exists
		const admin = await prisma.admin.findUnique({
			where: { login: email }
		})
		if (!admin) throw new ApiError(400, 'Логін або пароль не вірний')

		// check if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, admin.password)
		if (!isPasswordCorrect)
			throw new ApiError(400, 'Логін або пароль не вірний')

		// create tokens
		const adminDto = new AdminDto(admin)
		const tokens = tokenService.generateAdminAccessToken({ ...adminDto })

		// Return
		return {
			...tokens,
			user: adminDto
		}
	}

	async create(body: AdminCreateDto) {
		body.password = await bcrypt.hash(body.password, 12)

		const candidate = await prisma.admin.findUnique({
			where: { login: body.email }
		})
		if (candidate) throw new ApiError(409, 'Такий адміністратор вже існує')

		await prisma.admin.create({
			data: { login: body.email, password: body.password }
		})
	}

	async get() {
		return await prisma.admin.findMany()
	}

	async delete(id: number) {
		const candidate = await prisma.admin.findUnique({ where: { id } })
		if (!candidate) throw new ApiError(404, 'Такого адміністратора не існує')
		return await prisma.admin.delete({ where: { id } })
	}

	async verify(token: string) {
		const decoded = tokenService.validateAccessToken(token) as JwtPayload | null
		if (!decoded) throw new ApiError(401, 'Недійсний або прострочений токен')

		const id = decoded.id
		if (!id) throw new ApiError(404, 'Такого адміністратора не існує')

		const admin = await prisma.admin.findUnique({ where: { id } })
		if (!admin) throw new ApiError(404, 'Такого адміністратора не існує')

		const dto = new AdminDto(admin)
		return dto
	}
}

export const adminService = new AdminService()
