import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  ProductResponseDTO,
  ProductsResponseDTO,
} from 'src/dtos/product-response.dto';
import { CreateProductDTO } from 'src/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';
import { BucketService } from './bucket.service';
import path from 'node:path';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly bucketService: BucketService,
  ) {}

  async getOne(id: number, userId: number) {
    const product = await this.productRepository.findOne(id, userId);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async create(
    product: CreateProductDTO,
    userId: number,
    cover?: Express.Multer.File,
  ): Promise<ProductEntity> {
    let coverUrl: string | undefined = undefined;
    if (cover) {
      const { name, ext } = path.parse(cover.originalname);
      const randomData = Date.now().toString(36);
      const fileName = path.join(
        'products-covers',
        `${name}_${randomData}${ext}`,
      );

      try {
        coverUrl = await this.bucketService.uploadFile(fileName, cover.buffer);
      } catch (ex) {
        this.logger.error(
          `failed to upload image in product creation: ${(ex as Error)?.message}`,
          (ex as Error)?.stack,
        );
      }
    }

    return await this.productRepository.create(product, userId, coverUrl);
  }

  mapToResponse(product: ProductEntity): ProductResponseDTO {
    return plainToClass(ProductResponseDTO, product, {
      excludeExtraneousValues: true,
    });
  }

  mapListToResponse(
    products: ProductEntity[],
    total: number,
  ): ProductsResponseDTO {
    const items = plainToInstance(ProductResponseDTO, products);
    return {
      total,

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

  async getTotal(userId: number) {
    return await this.productRepository.countAll(userId);
  }
}
