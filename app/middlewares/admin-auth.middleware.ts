import { prisma } from '@/lib/prisma'
import { TOKEN } from '@/typing/enums'
import { ApiError } from '@/utils/api-error'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const unauthorized = () => {
	throw new ApiError(401, 'Не авторизований')
}

export async function adminAuthMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		const token = req.headers.authorization?.split(' ')?.[1]

		if (!token) {
			console.error('Admin Auth Middleware: Token is missing or undefined')
			unauthorized()
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET as string
		) as jwt.JwtPayload
		const user = await prisma.admin.findUnique({
			where: { login: decoded?.login }
		})

		if (!decoded || !decoded.login || !user) {
			console.error('Decoded token is invalid or missing login')
			unauthorized()
		}

		next()
	} catch (error: any) {
		console.error('Error verifying token:', error.message)
		next(error)
	}
}
