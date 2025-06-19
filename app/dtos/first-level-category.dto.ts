import { IsNotEmpty, IsString } from 'class-validator'

export class FirstLevelCategoryCreateDto {
	@IsString({ message: 'Назва (ru) повинна бути рядком' })
	@IsNotEmpty({ message: 'Назва (ru) є обов\'язковою' })
	ru: string

	@IsString({ message: 'Назва (ua) повинна бути рядком' })
	@IsNotEmpty({ message: 'Назва (ua) є обов\'язковою' })
	uk: string
}
