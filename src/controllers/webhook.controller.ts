import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { WebhookNewLeadDTO } from 'src/dtos/webhook-new-lead.dto';
import { WebhookNewSaleDTO } from 'src/dtos/webhook-new-sale.dto';
import { WebhookNewVisitDTO } from 'src/dtos/webhook-new-visit.dto';
import { WebhookWhatsappAlertsActivationDTO } from 'src/dtos/webhook-whatsapp-alerts-activation.dto';
import { WebhookService } from 'src/services/webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/visit')
  async newVisit(@Body() body: WebhookNewVisitDTO) {
    await this.webhookService.newVisit(body);
  }

  @Post('/lead')
  async newLead(@Body() body: WebhookNewLeadDTO) {
    await this.webhookService.newLead(body);
  }

  @Post('/sale')
  async newSale(@Body() body: WebhookNewSaleDTO) {
    await this.webhookService.newSale(body);
  }

  @Patch('/whatsapp-alerts-activation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async whatsappAlertsActivation(
    @Body() body: WebhookWhatsappAlertsActivationDTO,
  ) {
    await this.webhookService.whatsappActivation(body);
  }
}
