import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Config } from "src/config";

@Injectable()
class IAService
{
  constructor(
    private readonly httpService: HttpService
  ){}

  async token(): Promise<string> {
    const data = new URLSearchParams({
      client_id: Config.ia.client_id,
      grant_type: Config.ia.grant_type,
      username: Config.ia.username,
      password: Config.ia.password
    });

    const response = await firstValueFrom(
      this.httpService.post(Config.ia.token_url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      })
    );

    return response.data.access_token;
  }

  async message(
    content: string
  ): Promise<any> {
    const token = await this.token();
    const data = {
      messages: [{
        role: "user",
        content: content
      }],
      properties: {
        temperature: 0.5,
        topK: 5,
        stream: false,
        formatStreamResponse: false
      }
    };

    const response = await firstValueFrom(
      this.httpService.post(Config.ia.message_url, data, {
        headers: {
          "X-Request-Origin": "COGNA_DOCENTE_SABER",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
    );

    const [ responseData ] = response.data;
    return { message: responseData.message.content };
  }
}

export { IAService }