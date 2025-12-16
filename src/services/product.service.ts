import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  ProductResponseDTO,
  ProductsResponseDTO,
} from 'src/dtos/product-response.dto';
import { CreateProductDTO } from 'src/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getOne(id: number, userId: number) {
    const product = await this.productRepository.findOne(id, userId);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async create(
    product: CreateProductDTO,
    user: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productRepository.create(product, user);
  }

  mapToResponse(product: ProductEntity): ProductResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return plainToClass(ProductResponseDTO, product);
  }

  mapListToResponse(
    products: ProductEntity[],
    total: number,
  ): ProductsResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const items = plainToInstance(ProductResponseDTO, products);
    return {
      total,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      items,
    };
  }

  async delete(productId: number, userId: number) {
    const product = await this.productRepository.findOne(productId, userId);
    if (!product) {
      throw new ForbiddenException();
    }
    await this.productRepository.delete(productId);
  }

  async update(id: number, userId: number, data: CreateProductDTO) {
    const product = await this.productRepository.findOne(id, userId);
    if (!product) {
      throw new ForbiddenException();
    }
    await this.productRepository.update(id, data);
  }

  async getMany(userId: number, data: GetManyProductsDTO) {
    return await this.productRepository.findAllAndCount(userId, data);
  }
}
