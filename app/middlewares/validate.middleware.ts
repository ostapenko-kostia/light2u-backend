import { validate, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export const validateMiddleware = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dto = plainToInstance(dtoClass, req.body)
		const errors: ValidationError[] = await validate(dto)

		if (errors.length > 0) {
			// Extract a simple error message from the first error
			const firstError = errors[0]
			const errorMessage = firstError.constraints
				? Object.values(firstError.constraints)[0]
				: `Validation failed for ${firstError.property}`
			res.status(400).json({ message: errorMessage, ok: false })
		} else {
			req.body = instanceToPlain(dto)
			next()
		}
	}
}
