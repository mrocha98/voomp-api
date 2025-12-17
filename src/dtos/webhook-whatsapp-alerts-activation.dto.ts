import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class WebhookWhatsappAlertsActivationDTO {
  @IsString()
  @ApiProperty({ default: '5511940028922' })
  phoneNumber: string;

  @IsBoolean()
  @ApiProperty({ type: 'boolean' })
  active: boolean;
}
