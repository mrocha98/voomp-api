import { Injectable } from '@nestjs/common';
import { WebhookNewLeadDTO } from 'src/dtos/webhook-new-lead.dto';
import { WebhookNewSaleDTO } from 'src/dtos/webhook-new-sale.dto';
import { WebhookNewVisitDTO } from 'src/dtos/webhook-new-visit.dto';
import { WebhookWhatsappAlertsActivationDTO } from 'src/dtos/webhook-whatsapp-alerts-activation.dto';
import { LeadRepository } from 'src/repositories/lead.repository';
import { ProductVisitRepository } from 'src/repositories/product-visit.repository';
import { SaleRepository } from 'src/repositories/sale.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class WebhookService {
  constructor(
    private readonly visitRepository: ProductVisitRepository,
    private readonly leadRepository: LeadRepository,
    private readonly saleRepository: SaleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async newVisit(data: WebhookNewVisitDTO) {
    await this.visitRepository.create(data.productId);
  }

  async newLead(data: WebhookNewLeadDTO) {
    await this.leadRepository.create(data.productId, data.visitId);
  }

  async newSale(data: WebhookNewSaleDTO) {
    await this.saleRepository.create(
      data.productId,
      data.leadId,
      data.paymentMethod,
    );
    // TODO : validar se é primeira venda e disparar mensagem
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
