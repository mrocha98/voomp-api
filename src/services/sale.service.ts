import { Injectable } from '@nestjs/common';
import { startOfDay, sub } from 'date-fns';
import { ProductRepository } from 'src/repositories/product.repository';
import { SaleRepository } from 'src/repositories/sale.repository';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getTotal(userId: number) {
    const total = await this.saleRepository.countTotal(userId);
    return { total };
  }

  async getRevenue(userId: number) {
    const revenue = await this.saleRepository.countRevenue(userId);
    return { revenue };
  }

  private async getRevenuesFromStatistics(userId: number) {
    const startOfToday = startOfDay(new Date());
    const last30Days = sub(startOfToday, { days: 30 });
    const revenueDates = [startOfToday, last30Days];

    return await Promise.all(
      revenueDates.map((startFrom) =>
        this.saleRepository.countRevenue(userId, startFrom),
      ),
    );
  }

  private calculateConversionMetricsPercentage(
    part: number,
    total: number,
  ): number {
    if (total === 0) return 0;
    return Number(((part / total) * 100).toFixed(2));
  }

  private async getSalesFunnelData(userId: number) {
    const { leadsCount, salesCount, visitsCount } =
      await this.productRepository.countFunnelData(userId);

    return {
      totalVisits: visitsCount,
      totalLeads: leadsCount,
      totalSales: salesCount,
      conversionMetrics: {
        visitsToLeads: this.calculateConversionMetricsPercentage(
          leadsCount,
          visitsCount,
        ),
        leadsToSales: this.calculateConversionMetricsPercentage(
          salesCount,
          leadsCount,
        ),
        overallConversion: this.calculateConversionMetricsPercentage(
          salesCount,
          visitsCount,
        ),
      },
    };
  }

  async getStatistics(userId: number) {
    const [[todayRevenue, last30DaysRevenue], salesFunnel] = await Promise.all([
      this.getRevenuesFromStatistics(userId),
      this.getSalesFunnelData(userId),
    ]);

    return {
      todayRevenue,
      last30DaysRevenue,
      salesFunnel,
    };
  }
}
