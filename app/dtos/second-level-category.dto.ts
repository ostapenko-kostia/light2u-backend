import { IsNotEmpty, IsString } from 'class-validator'

export class SecondLevelCategoryCreateDto {
	@IsString({ message: 'Назва (ru) повинна бути рядком' })
	@IsNotEmpty({ message: 'Назва (ru) є обов\'язковою' })
	ru: string

	@IsString({ message: 'Назва (ua) повинна бути рядком' })
	@IsNotEmpty({ message: 'Назва (ua) є обов\'язковою' })
	uk: string

	@IsString({ message: 'Вкажіть батьківську категорію' })
	@IsNotEmpty({ message: 'Вкажіть батьківську категорію' })
	parentCategorySlug: string
}
