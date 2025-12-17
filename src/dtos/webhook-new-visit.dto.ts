import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class WebhookNewVisitDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  productId: number;
}
