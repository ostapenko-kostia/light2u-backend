import { IsNotEmpty, IsString } from 'class-validator'

export class TextEditDto {
	@IsString({ message: 'Текст повинен бути рядком' })
	@IsNotEmpty({ message: 'Текст є обов\'язковим' })
	text: string
}
