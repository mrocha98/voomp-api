/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import {
  ProductBillingType,
  ProductCategory,
  ProductType,
} from 'src/enums/product';

export class CreateProductDTO {
  @IsEnum(ProductType)
  @ApiProperty({ enum: ProductType, default: ProductType.infoProduct })
  type: ProductType;

  @IsEnum(ProductCategory)
  @ApiProperty({ enum: ProductCategory, default: ProductCategory.educational })
  category: ProductCategory;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Curso de Lorem Ipsum' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Lorem ipsum dolor sit amet.' })
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'http://pudim.com.br', required: false })
  website?: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ default: 7 })
  warrantyInDays: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({ default: 199.99 })
  price: number;

  @IsEnum(ProductBillingType)
  @ApiProperty({
    enum: ProductBillingType,
    default: ProductBillingType.oneTime,
  })
  billingType: ProductBillingType;
}
