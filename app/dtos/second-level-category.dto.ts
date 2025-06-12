import { IsNotEmpty, IsString } from 'class-validator'

export class SecondLevelCategoryCreateDto {
	@IsString()
	@IsNotEmpty()
	ru: string

	@IsString()
	@IsNotEmpty()
	uk: string

	@IsString()
	@IsNotEmpty()
	parentCategorySlug: string
}
