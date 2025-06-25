import { ContactUsDto } from '@/dtos/email.dto'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { emailService } from '@/services/email.service'
import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

router.post(
	'/contact-us',
	validateMiddleware(ContactUsDto),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await emailService.sendContactUsEmail(req.body)
			res.status(200).json({ success: true })
		} catch (error) {
			next(error)
		}
	}
)

export default router
