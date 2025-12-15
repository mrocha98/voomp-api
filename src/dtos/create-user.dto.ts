/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Goal, HowKnew } from 'src/enums/user-onboarding';

class UserOnboardingDTO {
  @IsOptional()
  @IsEnum(HowKnew)
  @ApiProperty({ enum: HowKnew, required: false })
  howKnew?: HowKnew;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  alreadySellOnline?: boolean;

  @IsOptional()
  @IsEnum(Goal)
  @ApiProperty({ enum: Goal, required: false })
  goal?: Goal;
}

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  cpf: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
    message: 'Senha não atende os critérios mínimos',
  })
  @ApiProperty({ default: 'Voomp@2025' })
  password: string;

  @ValidateNested()
  @Type(() => UserOnboardingDTO)
  @ApiProperty()
  onboarding: UserOnboardingDTO;
}
