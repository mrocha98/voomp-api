import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod } from 'src/enums/sale';

export class WebhookNewSaleDTO {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  leadId: number;

  @ApiProperty({
    enum: PaymentMethod,
    default: PaymentMethod.pix,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
