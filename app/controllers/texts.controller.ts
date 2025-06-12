import { TextEditDto } from '@/dtos/text.dto'
import { adminAuthMiddleware } from '@/middlewares/admin-auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { textsService } from '@/services/texts.service'
import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await textsService.all()
		res.status(200).json({ data, ok: true })
	} catch (error) {
		next(error)
	}
})

router.put(
	'/:id',
	adminAuthMiddleware,
	validateMiddleware(TextEditDto),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const body = req.body
			const id = +req.params.id
			const data = await textsService.edit(id, body.text)
			res.status(200).json({ data, ok: true })
		} catch (error) {
			next(error)
		}
	}
)

export const textsController = router
