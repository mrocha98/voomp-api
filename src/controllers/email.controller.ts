import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { Config } from '../config';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Get('config')
  // getConfig() {
  //   return {
  //     region: Config.email.region,
  //     source: Config.email.source,
  //     hasCredentials: {
  //       accessKeyId: Config.email.accessKeyId,
  //       secretAccessKey: Config.email.secretAccessKey,
  //     },
  //   };
  // }

  @Post('send')
  async sendEmail(
    @Body() body: { to: string; subject: string; message: string },
  ) {
    try {
      await this.emailService.sendEmail(body.to, body.subject, body.message);
      return { success: true, message: 'Email enviado com sucesso!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
