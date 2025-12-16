/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsOptional } from 'class-validator';
import { PaginationDTO } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

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
  orderBy: OrderBy = 'title';
}
