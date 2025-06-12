import { IsNotEmpty, IsString } from 'class-validator'

export class FirstLevelCategoryCreateDto {
	@IsString()
	@IsNotEmpty()
	ru: string

	@IsString()
	@IsNotEmpty()
	uk: string
}
