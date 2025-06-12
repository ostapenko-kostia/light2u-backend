import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { secondLevelCategoryService } from '@/services/second-level-category.service'
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
	upload.single('image'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const name = JSON.parse(req.body.name)
			const image = req.file
			const parentCategorySlug = req.body.parentCategorySlug
			const category = await secondLevelCategoryService.create(
				parentCategorySlug,
				name,
				image
			)
			res.status(200).json({ category, ok: true })
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
			const name = JSON.parse(req.body.name)
			const image = req.file
			const id = +req.params.id
			const category = await secondLevelCategoryService.edit(id, name, image)
			res.status(200).json({ category, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const serviceResponse = await secondLevelCategoryService.get()
		res.status(200).json({ data: serviceResponse, ok: true })
	} catch (error) {
		next(error)
	}
})

router.delete(
	'/:id',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await secondLevelCategoryService.delete(+req.params.id)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const secondLevelCategoryController = router
