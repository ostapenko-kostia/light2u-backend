import 'reflect-metadata'
import {
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
	Min,
	ValidateNested,
	ArrayNotEmpty,
	IsArray,
	IsOptional
} from 'class-validator'
import { Type } from 'class-transformer'

class ProductInfoDto {
	@IsString({ message: 'Назва характеристики повинна бути рядком' })
	@IsNotEmpty({ message: "Назва характеристики є обов'язковою" })
	key: string

	@IsString({ message: 'Значення характеристики повинне бути рядком' })
	@IsNotEmpty({ message: "Значення характеристики є обов'язковим" })
	value: string

	@IsNumber(
		{ allowNaN: false, allowInfinity: false },
		{ message: 'Порядок повинен бути числом' }
	)
	@Min(0, { message: "Порядок не може бути від'ємним" })
	order: number
}

export class ProductCreateDto {
	@IsString({ message: 'Назва повинна бути рядком' })
	@IsNotEmpty({ message: "Назва є обов'язковою" })
	name: string

	@IsNumber(
		{ allowNaN: false, allowInfinity: false },
		{ message: 'Ціна повинна бути числом' }
	)
	@IsPositive({ message: "Ціна не може бути від'ємною" })
	price: number

	@IsString({ message: 'Опис повинен бути рядком' })
	@IsNotEmpty({ message: "Опис є обов'язковим" })
	description: string

	@IsString({ message: 'Категорія не вказана' })
	@IsNotEmpty({ message: 'Категорія не вказана' })
	categorySlug: string

	@IsArray({ message: 'Характеристики повинні бути масивом' })
	@ValidateNested({ each: true })
	@Type(() => ProductInfoDto)
	@IsOptional()
	productInfo: ProductInfoDto[]

	@IsString({ message: 'Мова не вказана' })
	@IsNotEmpty({ message: 'Мова не вказана' })
	@IsIn(['uk', 'ru'])
	locale: 'uk' | 'ru'

	@IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Кількість повинна бути числом' })
	@Min(0, { message: "Кількість не може бути від'ємною" })
	quantity: number
}

export class ProductEditDto {
	@IsString({ message: 'Назва повинна бути рядком' })
	@IsOptional()
	name: string

	@IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Ціна повинна бути числом' })
	@IsPositive({ message: "Ціна не може бути від'ємною" })
	@IsOptional()
	price: number

	@IsString({ message: 'Опис повинен бути рядком' })
	@IsOptional()
	description: string

	@IsString({ message: 'Категорія не вказана' })
	@IsOptional()
	categorySlug: string

	@IsArray({ message: 'Характеристики повинні бути масивом' })
	@ValidateNested({ each: true })
	@Type(() => ProductInfoDto)
	@IsOptional()
	productInfo: ProductInfoDto[]

	@IsString({ message: 'Мова не вказана' })
	@IsIn(['uk', 'ru'])
	@IsOptional()
	locale: 'uk' | 'ru'

	@IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Кількість повинна бути числом' })
	@Min(0, { message: "Кількість не може бути від'ємною" })
	@IsOptional()
	quantity: number
}
