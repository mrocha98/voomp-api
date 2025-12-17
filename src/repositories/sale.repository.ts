import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from 'src/entities/sale.entity';
import { PaymentMethod } from 'src/enums/sale';
import { Repository } from 'typeorm';

@Injectable()
export class SaleRepository {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  async create(
    productId: number,
    leadId: number,
    paymentMethod: PaymentMethod,
  ) {
    return await this.saleRepository.save({
      product: { id: productId },
      lead: { id: leadId },
      paymentMethod,
    });
  }

  async countTotal(userId: number) {
    return await this.saleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .where('product.userId = :userId', { userId })
      .getCount();
  }

  async countRevenue(userId: number, startFrom?: Date) {
    const query = this.saleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .select('SUM(product.price)', 'totalSum')
      .where('product.userId = :userId', { userId });

    const result = await query.getRawOne<{ totalSum: string }>();
    if (startFrom) {
      query.andWhere('sale.createdAt >= :startFrom', { startFrom });
    }

    return result?.totalSum ? parseFloat(result.totalSum) : 0;
  }
}
