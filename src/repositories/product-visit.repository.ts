import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVisitEntity } from 'src/entities/product-visit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVisitRepository {
  constructor(
    @InjectRepository(ProductVisitEntity)
    private readonly visitRepository: Repository<ProductVisitEntity>,
  ) {}

  async create(productId: number) {
    return await this.visitRepository.save({ product: { id: productId } });
  }
}
