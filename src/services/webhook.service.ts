import { Injectable } from '@nestjs/common';
import { WebhookNewLeadDTO } from 'src/dtos/webhook-new-lead.dto';
import { WebhookNewSaleDTO } from 'src/dtos/webhook-new-sale.dto';
import { WebhookNewVisitDTO } from 'src/dtos/webhook-new-visit.dto';
import { WebhookWhatsappAlertsActivationDTO } from 'src/dtos/webhook-whatsapp-alerts-activation.dto';
import { LeadRepository } from 'src/repositories/lead.repository';
import { ProductVisitRepository } from 'src/repositories/product-visit.repository';
import { SaleRepository } from 'src/repositories/sale.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { WhatsappAlertsService } from './whatsapp-alerts.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly visitRepository: ProductVisitRepository,
    private readonly leadRepository: LeadRepository,
    private readonly saleRepository: SaleRepository,
    private readonly userRepository: UserRepository,
    private readonly whatsappAlertsService: WhatsappAlertsService,
  ) {}

  async newVisit(data: WebhookNewVisitDTO) {
    const visit = await this.visitRepository.create(data.productId);
    return { id: visit.id };
  }

  async newLead(data: WebhookNewLeadDTO) {
    const lead = await this.leadRepository.create(data.productId, data.visitId);
    return { id: lead.id };
  }

  async newSale(data: WebhookNewSaleDTO) {
    const sale = await this.saleRepository.create(
      data.productId,
      data.leadId,
      data.paymentMethod,
    );

    if (sale.isFirst) {
      const user = await this.userRepository.getUserOfSale(sale.id);
      if (user?.whatsappAlertsActivated) {
        await this.whatsappAlertsService.sendFirstSaleMessage(user.phoneNumber);
      }
    }

    return { id: sale.id };
  }

  async whatsappActivation(data: WebhookWhatsappAlertsActivationDTO) {
    const user = await this.userRepository.findByPhoneNumber(data.phoneNumber);
    if (!user) {
      return;
    }

    await this.userRepository.updateWhatsappAlertsActivated(
      user.id,
      data.active,
    );
  }
}
