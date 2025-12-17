import { ApiProperty } from '@nestjs/swagger';

export class GetPendingStepsResponseDTO {
  @ApiProperty({ type: 'boolean' })
  hasPersonalData: boolean;

  @ApiProperty({ type: 'boolean' })
  hasIdentityValidated: boolean;

  @ApiProperty({ type: 'boolean' })
  hasBusinessData: boolean;

  @ApiProperty({ type: 'boolean' })
  hasProducts: boolean;

  @ApiProperty({ type: 'boolean' })
  hasSales: boolean;
}
