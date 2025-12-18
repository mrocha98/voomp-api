import { Injectable, Logger } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Cron } from '@nestjs/schedule';
import { UserRepository } from 'src/repositories/user.repository';
import { SaleRepository } from 'src/repositories/sale.repository';
import { startOfDay, sub } from 'date-fns';
import { ProductRepository } from 'src/repositories/product.repository';
import { catchError, delay, firstValueFrom, of } from 'rxjs';

@Injectable()
export class WhatsappAlertsService {
  private readonly logger = new Logger(WhatsappAlertsService.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly userRepository: UserRepository,
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async sendFirstSaleMessage(phoneNumber: string) {
    const message = [
      '✅ *Primeira venda confirmada, parabéns!*',
      'Primeira etapa validada, existe demanda para o seu produto.',
      'Com a *Voomp*, você tem estrutura para crescer.',
    ].join('\n\n');

    await firstValueFrom(
      this.whatsappService.sendMessage(phoneNumber, message).pipe(
        catchError((error) => {
          this.logger.error(
            `failed to send first sale message to phoneNumber ${phoneNumber}: ${(error as Error)?.message}`,
            (error as Error)?.stack,
          );
          return of(null);
        }),
      ),
    );
  }

  // every Monday at 9am
  @Cron('0 9 * * 1', {
    timeZone: 'America/Sao_Paulo',
    name: 'whatsapp-morning-call',
  })
  async morningCallCronJob() {
    this.logger.log('Initializing whatsapp-morning-call cron job...');

    const users = await this.userRepository.getMorningCallUsers();
    if (!users.length) {
      this.logger.log('Skipping job, zero users qualified');
      return;
    }

    const startOfPreviousWeek = sub(startOfDay(new Date()), { weeks: 1 });
    for (const user of users) {
      const [salesAmount, productsAmount] = await Promise.all([
        this.saleRepository.countAmount(user.id, startOfPreviousWeek),
        this.productRepository.countAll(user.id, true),
      ]);
      const supportAmount = this.mockedSupportAmount();

      const text = this.makeMorningCallText({
        salesAmount,
        productsAmount,
        supportAmount,
      });

      await firstValueFrom(
        this.whatsappService.sendMessage(user.phoneNumber, text).pipe(
          delay(200), // to prevent rate-limit/spam detection by whatsapp
          catchError((error) => {
            this.logger.error(
              `failed to send morning call to user with id ${user.id}`,
              (error as Error).stack,
            );
            return of(null);
          }),
        ),
      );
    }
  }

  private mockedSupportAmount() {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(15);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  private makeMorningCallText({
    salesAmount,
    productsAmount,
    supportAmount,
  }: {
    salesAmount: number;
    productsAmount: number;
    supportAmount: number;
  }) {
    return [
      '*Morning call Voomp - Resumo do seu negócio na última semana*',
      `*💰 Vendas:* ${salesAmount} vendas realizadas na última semana.`,
      `*📦 Produtos ativos:* ${productsAmount} produtos gerando vendas.`,
      `*💬 Atendimento:* ${supportAmount} novas solicitações de cliente.`,
      '*🎯 Fique ligado:* nesta semana, teremos uma live no *instagram* sobre estratégias para aumentar suas conversões.',
      'Boas vendas e conte com a *Voomp* para escalar o seu negócio digital 🚀',
    ].join('\n\n');
  }
}
