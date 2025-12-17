import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Goal, HowKnew } from 'src/enums/user-onboarding';

class UserOnboardingResponseDTO {
  @Expose()
  @ApiProperty({ enum: HowKnew, required: false })
  howKnew?: HowKnew;

  @Expose()
  @ApiProperty({ required: false })
  alreadySellOnline?: boolean;

  @Expose()
  @ApiProperty({ enum: Goal, required: false })
  goal?: Goal;
}

export class UserResponseDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  cpf: string;

  @Expose()
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @ApiProperty({ type: UserOnboardingResponseDTO })
  @Type(() => UserOnboardingResponseDTO)
  onboarding: UserOnboardingResponseDTO;
}
