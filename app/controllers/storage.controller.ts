import { deleteFile, getAllFiles, uploadFile } from '@/lib/s3'
import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { NextFunction, Request, Response, Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024 // 5MB limit
	}
})

router.get(
	'/',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const files = await getAllFiles()
			res.status(200).json({ data: files, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.post(
	'/',
	adminAuthMiddleware,
	upload.single('file'),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const file = req.file

			const fileBuffer = await sharp(file.buffer).toFormat('jpg').toBuffer()
			await uploadFile(fileBuffer, `image-${Date.now()}.jpg`)

			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

router.delete(
	'/:key',
	adminAuthMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const key = req.params.key
			await deleteFile(
				`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`
			)
			res.status(200).json({ ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const storageController = router
