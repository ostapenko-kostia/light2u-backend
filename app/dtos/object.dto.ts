import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class ObjectCreateDto {
	@IsString({ message: 'Назва повинна бути рядком' })
	@IsNotEmpty({ message: "Назва є обов'язковою" })
	name: string

	@IsString({ message: 'Опис повинен бути рядком' })
	@IsNotEmpty({ message: "Опис є обов'язковим" })
	description: string

	@IsString({ message: 'Місто повинне бути рядком' })
	@IsNotEmpty({ message: "Місто є обов'язковим" })
	city: string

	@IsString({ message: 'Адреса повинна бути рядком' })
	@IsNotEmpty({ message: "Адреса є обов'язковою" })
	address: string

	@IsString({ message: 'Мова не вказана' })
	@IsNotEmpty({ message: 'Мова не вказана' })
	@IsIn(['uk', 'ru'])
	locale: string
}

export class ObjectEditDto {
	@IsString({ message: 'Назва повинна бути рядком' })
	name: string

	@IsString({ message: 'Опис повинен бути рядком' })
	description: string

	@IsString({ message: 'Місто повинне бути рядком' })
	city: string

	@IsString({ message: 'Адреса повинна бути рядком' })
	address: string
}
