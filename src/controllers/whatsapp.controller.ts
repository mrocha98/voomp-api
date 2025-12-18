import { Controller, Get } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WhatsappService } from 'src/services/whatsapp.service';

@Controller('/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('/start-url')
  async getStartUrl() {
    const {
      data: { link },
    } = await firstValueFrom(this.whatsappService.getStartUrl());
    return { link };
  }
}
