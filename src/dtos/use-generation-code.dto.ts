/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UseGenerationCodeDTO {
  @IsEmail()
  @ApiProperty()
  email: string;
}
