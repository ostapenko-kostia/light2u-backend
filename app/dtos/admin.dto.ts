import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AdminLoginDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string
}

export class AdminCreateDto {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string
}

export class AdminDto {
	login: string
	id: number

	constructor(model: { login: string; id: number }) {
		this.login = model.login
		this.id = model.id
	}
}
