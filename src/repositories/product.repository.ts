import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDTO } from 'src/dtos/create-product.dto';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findOne(id: number, userId: number) {
    return await this.productRepository.findOneBy({ id, user: { id: userId } });
  }

  async create(product: CreateProductDTO, userId: number, coverUrl?: string) {
    return await this.productRepository.save({
      ...product,
      user: { id: userId },
      coverUrl,
    });
  }

  async delete(id: number) {
    await this.productRepository.delete({ id });
  }

  async update(id: number, data: CreateProductDTO) {
    await this.productRepository.update({ id }, data);
  }

  async findAllAndCount(
    userId: number,
    {
      page = 1,
      size = 10,
      order = 'ASC',
      orderBy = 'title',
    }: GetManyProductsDTO,
  ) {
    const offset = (page - 1) * 10;
    return await this.productRepository.findAndCount({
      where: { user: { id: userId } },
      order: { [orderBy]: order },
      skip: offset,
      take: size,
    });
  }

  async countAll(userId: number) {
    return await this.productRepository.count({
      where: { user: { id: userId } },
    });
  }

  async countFunnelData(userId: number) {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('COUNT(DISTINCT visits.id)', 'visits')
      .addSelect('COUNT(DISTINCT leads.id)', 'leads')
      .addSelect('COUNT(DISTINCT sales.id)', 'sales')
      .leftJoin('product.visits', 'visits')
      .leftJoin('product.leads', 'leads')
      .leftJoin('product.sales', 'sales')
      .where('product.user.id = :userId', { userId })
      .getRawOne<{ visits?: string; leads?: string; sales?: string }>();

    const visitsCount = Number(result?.visits ?? 0);
    const leadsCount = Number(result?.leads ?? 0);
    const salesCount = Number(result?.sales ?? 0);

    return { visitsCount, leadsCount, salesCount };
  }
}
