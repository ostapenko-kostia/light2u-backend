import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ContactUsDto {
	@IsString({ message: "Будь ласка, вкажіть ваше ім'я" })
	@IsNotEmpty({ message: "Будь ласка, вкажіть ваше ім'я" })
	name: string

	@IsEmail({}, { message: 'Будь ласка, вкажіть вашу електронну пошту' })
	@IsNotEmpty({ message: 'Будь ласка, вкажіть вашу електронну пошту' })
	email: string

	@IsString({ message: 'Будь ласка, вкажіть ваше повідомлення' })
	@IsNotEmpty({ message: 'Будь ласка, вкажіть ваше повідомлення' })
	message: string
}