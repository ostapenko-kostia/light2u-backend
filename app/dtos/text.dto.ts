import { IsNotEmpty, IsString } from 'class-validator'

export class TextEditDto {
	@IsString()
	@IsNotEmpty()
	text: string
}
