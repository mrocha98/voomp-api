import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadEntity } from 'src/entities/lead.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeadRepository {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,
  ) {}

  async create(productId: number, visitId: number) {
    return await this.leadRepository.save({
      product: { id: productId },
      visit: { id: visitId },
    });
  }
}
