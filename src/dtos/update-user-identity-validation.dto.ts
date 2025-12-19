import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserIdentityValidationDTO {
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  valid: boolean;
}
