import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class SlideCreateDto {
	@IsString()
	@IsNotEmpty()
	text: string

	@IsString()
	@IsNotEmpty()
	@IsUrl()
	url: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsString()
	@IsNotEmpty()
	@IsIn(['uk', 'ru'])
	locale: string
}
