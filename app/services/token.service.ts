import jwt from 'jsonwebtoken'

class TokenService {
	generateAdminAccessToken(payload: object) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_SECRET as string,
			{
				expiresIn: '1d'
			}
		)

		return { accessToken }
	}

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(
				token,
				process.env.JWT_ACCESS_SECRET as string
			)
			return userData
		} catch (e) {
			return null
		}
	}
}

export const tokenService = new TokenService()
