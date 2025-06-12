import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { slideService } from '@/services/slide.service'
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

router.post(
	'/',
	adminAuthMiddleware,
	upload.single('background'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const image = req.file
			const info = JSON.parse(req.body.info)

			const slide = await slideService.create(info, image)

			res.status(200).json({ slide, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.put(
	'/:id',
	adminAuthMiddleware,
	upload.single('image'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const image = req.file
			const info = JSON.parse(req.body.info)
			const id = +req.params.id

			const slide = await slideService.edit(id, info, image)
			res.status(200).json({ slide, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await slideService.get()
		res.status(200).json({ data, ok: true })
	} catch (error) {
		next(error)
	}
})

router.delete(
	'/:id',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await slideService.delete(+req.params.id)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const slidesController = router
