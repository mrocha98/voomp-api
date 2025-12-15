/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail } from 'class-validator';

export class GetGenerationCodeDTO {
  @IsEmail()
  email: string;
}
