import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WebhookNewLeadDTO {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  visitId: number;
}
