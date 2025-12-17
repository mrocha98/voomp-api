import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { PaginationDTO } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const orderByValues = ['createdAt', 'updatedAt', 'title'] as const;

type OrderBy = (typeof orderByValues)[number];

export class GetManyProductsDTO extends PaginationDTO {
  @IsOptional()
  @IsIn(orderByValues)
  @ApiProperty({
    required: false,
    enum: orderByValues,
    default: 'title',
  })
  orderBy?: OrderBy;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ required: false, type: 'boolean' })
  countOnly?: boolean;
}
