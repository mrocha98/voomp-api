/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductBillingType, ProductCategory } from 'src/enums/product';

export class ProductResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ProductCategory })
  category: ProductCategory;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty()
  warrantyInDays: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ProductBillingType })
  billingType: ProductBillingType;

  @ApiProperty({ required: false })
  imageUrl?: string;
}

export class ProductsResponseDTO {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: ProductResponseDTO, isArray: true })
  @Type(() => ProductResponseDTO)
  items: ProductResponseDTO[];
}
