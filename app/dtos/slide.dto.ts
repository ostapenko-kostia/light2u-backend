import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class SlideCreateDto {
	@IsString({ message: 'Текст повинен бути рядком' })
	@IsNotEmpty({ message: 'Текст є обов\'язковим' })
	text: string

	@IsString({ message: 'URL повинен бути рядком' })
	@IsNotEmpty({ message: 'URL є обов\'язковим' })
	@IsUrl({}, { message: 'Некоректний формат URL' })
	url: string

	@IsString({ message: 'Опис повинен бути рядком' })
	@IsNotEmpty({ message: 'Опис є обов\'язковим' })
	description: string

	@IsString({ message: 'Мова не вказана' })
	@IsNotEmpty({ message: 'Мова не вказана' })
	@IsIn(['uk', 'ru'])
	locale: string
}
