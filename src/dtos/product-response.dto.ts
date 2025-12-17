import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductBillingType, ProductCategory } from 'src/enums/product';

export class ProductResponseDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ enum: ProductCategory })
  category: ProductCategory;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty({ required: false })
  website?: string;

  @Expose()
  @ApiProperty()
  warrantyInDays: number;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty({ enum: ProductBillingType })
  billingType: ProductBillingType;

  @Expose()
  @ApiProperty({ required: false })
  imageUrl?: string;
}

export class ProductsResponseDTO {
  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty({ type: ProductResponseDTO, isArray: true })
  @Type(() => ProductResponseDTO)
  items: ProductResponseDTO[];
}
