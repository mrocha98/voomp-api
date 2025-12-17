import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

const orderValues = ['ASC', 'DESC'] as const;

type OrderValue = (typeof orderValues)[number];

export abstract class PaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false, default: 10 })
  size?: number;

  @IsOptional()
  @IsIn(orderValues)
  @ApiProperty({ required: false, default: 'ASC', enum: orderValues })
  order?: OrderValue;
}
