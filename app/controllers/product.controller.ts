import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { productService } from '@/services/product.service'
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
		const serviceResponse = await productService.get()
		res.status(200).json({ data: serviceResponse, ok: true })
	} catch (error) {
		next(error)
	}
})

router.post(
	'/',
	adminAuthMiddleware,
	upload.array('images'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const productInfo = JSON.parse(req.body.productInfo)
			const images = req.files
			const product = await productService.create(productInfo, images)
			res.status(200).json({ product, ok: true })
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
			const productInfo = JSON.parse(req.body.productInfo ?? '{}')
			const images = req.files
			const id = +req.params.id
			const product = await productService.edit(id, productInfo, images)
			res.status(200).json({ product, ok: true })
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
			await productService.delete(id)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.post(
	'/:id/duplicate',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = +req.params.id
			const product = await productService.duplicate(id)
			res.status(200).json({ product, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.patch(
	'/:id/move-up',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = +req.params.id
			const product = await productService.moveUp(id)
			res.status(200).json({ product, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.patch(
	'/:id/move-down',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const id = +req.params.id
			const product = await productService.moveDown(id)
			res.status(200).json({ product, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const productController = router
