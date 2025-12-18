import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';

@Injectable()
export class WhatsappService {
  constructor(private readonly httpService: HttpService) {}

  private makeAuth() {
    return {
      username: Config.whatsapp_api.auth_user,
      password: Config.whatsapp_api.auth_pass,
    };
  }

  sendMessage(phoneNumber: string, text: string) {
    return this.httpService.post<
      { id: string; phoneNumber: string },
      { phoneNumber: string; text: string }
    >(
      `${Config.whatsapp_api.url}/api/v1/whatsapp/message`,
      { phoneNumber, text },
      { auth: this.makeAuth() },
    );
  }

  getStartUrl() {
    return this.httpService.get<{ link: string }>(
      `${Config.whatsapp_api.url}/api/v1/whatsapp/start-url`,
      { auth: this.makeAuth() },
    );
  }
}
