/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Goal, HowKnew } from 'src/enums/user-onboarding';

class CreateUserOnboardingResponseDTO {
  @ApiProperty({ enum: HowKnew, required: false })
  howKnew?: HowKnew;

  @ApiProperty({ required: false })
  alreadySellOnline?: boolean;

  @ApiProperty({ enum: Goal, required: false })
  goal?: Goal;
}

export class CreateUserResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ type: CreateUserOnboardingResponseDTO })
  @Type(() => CreateUserOnboardingResponseDTO)
  onboarding: CreateUserOnboardingResponseDTO;
}
