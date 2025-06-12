import { AdminCreateDto, AdminLoginDto } from '@/dtos/admin.dto'
import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { adminService } from '@/services/admin.service'
import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

router.post(
	'/login',
	validateMiddleware(AdminLoginDto),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body
			const serviceResponse = await adminService.login(data)
			res.status(200).json({ ...serviceResponse, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.post(
	'/create',
	adminAuthMiddleware,
	validateMiddleware(AdminCreateDto),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body
			await adminService.create(data)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.get(
	'/',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const serviceResponse = await adminService.get()
			res.status(200).json({ data: serviceResponse, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.delete(
	'/:id',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await adminService.delete(+req.params.id)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const adminController = router
