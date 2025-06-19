import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AdminLoginDto {
	@IsString({ message: 'Електронна адреса повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної адреси' })
	@IsNotEmpty({ message: 'Електронна адреса є обов\'язковою' })
	email: string

	@IsString({ message: 'Пароль повинен бути рядком' })
	@IsNotEmpty({ message: 'Пароль є обов\'язковим' })
	password: string
}

export class AdminCreateDto {
	@IsString({ message: 'Електронна адреса повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної адреси' })
	@IsNotEmpty({ message: 'Електронна адреса є обов\'язковою' })
	email: string

	@IsString({ message: 'Пароль повинен бути рядком' })
	@IsNotEmpty({ message: 'Пароль є обов\'язковим' })
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
