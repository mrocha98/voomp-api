import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDTO } from 'src/dtos/create-product.dto';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
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

  async create(product: CreateProductDTO, user: UserEntity) {
    const newProduct = await this.productRepository.save({ ...product, user });
    return newProduct;
  }

  async delete(id: number) {
    await this.productRepository.delete({ id });
  }

  async update(id: number, data: CreateProductDTO) {
    await this.productRepository.update({ id }, data);
  }

  async findAllAndCount(
    userId: number,
    { page, size, order, orderBy }: GetManyProductsDTO,
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
}
