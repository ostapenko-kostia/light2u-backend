import { ApiError } from '@/utils/api-error'
import { NextFunction, Request, Response } from 'express'

export function errorMiddleware(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	try {
		if (res.headersSent) {
			return next(err)
		}

		if (err instanceof ApiError) {
			res.status(err.status).json({ message: err.message, ok: false })
			return
		}

		console.error('Непередбачувана помилка:', err)

		res
			.status(500)
			.json({ message: 'Сталася непередбачувана помилка', ok: false })
	} catch (error) {
		console.error('Помилка в обробнику помилок:', error)
		return next()
	}
}
