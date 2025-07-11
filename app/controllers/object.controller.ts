import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { objectService } from '@/services/object.service'
import { NextFunction, Request, Response, Router } from 'express'
import multer from 'multer'

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024 // 5MB limit
	}
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await objectService.getAll()
		res.status(200).json({ data, ok: true })
	} catch (error) {
		next(error)
	}
})

router.get(
	'/id/:id',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await objectService.getById(+req.params.id)
			res.status(200).json({ data, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.get(
	'/slug/:slug',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await objectService.getBySlug(req.params.slug)
			res.status(200).json({ data, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.post(
	'/',
	adminAuthMiddleware,
	upload.array('images'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const info = JSON.parse(req.body.info)
			const images = req.files
			const object = await objectService.create(info, images)
			res.status(200).json({ object, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.put(
	'/:id',
	adminAuthMiddleware,
	upload.array('images'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const info = JSON.parse(req.body.info ?? '{}')
			const images = req.files
			const id = +req.params.id
			const object = await objectService.edit(id, info, images)
			res.status(200).json({ object, ok: true })
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
			const id = +req.params.id
			await objectService.delete(id)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const objectController = router
