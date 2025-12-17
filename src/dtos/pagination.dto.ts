/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

const orderValues = ['ASC', 'DESC'] as const;

type OrderValue = (typeof orderValues)[number];

export abstract class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false, default: 1 })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false, default: 10 })
  size: number = 10;

  @IsOptional()
  @IsIn(orderValues)
  @ApiProperty({ required: false, default: 'ASC', enum: orderValues })
  order: OrderValue = 'ASC';
}
