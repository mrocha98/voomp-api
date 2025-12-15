import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  // eslint-disable-next-line @typescript-eslint/require-await
  async createMailer(): Promise<
    nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  > {
    return nodemailer.createTransport({
      host: `email-smtp.${Config.email.region}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: {
        user: Config.email.username,
        pass: Config.email.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const createMailer = await this.createMailer();
      await createMailer.sendMail({
        from: `"Voomp" <${Config.email.source}>`,
        replyTo: Config.email.source,
        subject: subject,
        html: html,
        to: to,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
