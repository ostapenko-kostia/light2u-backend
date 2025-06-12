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
	@IsString()
	@IsNotEmpty()
	key: string

	@IsString()
	@IsNotEmpty()
	value: string

	@IsNumber()
	@Min(0)
	order: number
}

export class ProductCreateDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsNumber()
	@IsPositive()
	price: number

	@IsString()
	@IsNotEmpty()
	description: string

	@IsString()
	@IsNotEmpty()
	categorySlug: string

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ProductInfoDto)
	productInfo: ProductInfoDto[]

	@IsString()
	@IsNotEmpty()
	@IsIn(['uk', 'ru'])
	locale: 'uk' | 'ru'

	@IsNumber()
	@Min(0)
	quantity: number
}

export class ProductEditDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name: string

	@IsNumber()
	@IsPositive()
	@IsOptional()
	price: number

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	description: string

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	categorySlug: string

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ProductInfoDto)
	@IsOptional()
	productInfo: ProductInfoDto[]

	@IsString()
	@IsNotEmpty()
	@IsIn(['uk', 'ru'])
	@IsOptional()
	locale: 'uk' | 'ru'

	@IsNumber()
	@Min(0)
	@IsOptional()
	quantity: number
}
