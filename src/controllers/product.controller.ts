import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from 'src/decorators/user.decorator';
import { CreateProductDTO } from 'src/dtos/create-product.dto';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { ProductService } from 'src/services/product.service';

@ApiBearerAuth('bearerAuth')
@Controller('/products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getMany(
    @Query() query: GetManyProductsDTO,
    @User('id') userId: number,
  ) {
    const [products, total] = await this.productService.getMany(userId, query);
    return this.productService.mapListToResponse(products, total);
  }

  @Get('/:id')
  async getOne(@Param('id') id: string, @User('id') userId: number) {
    const product = await this.productService.getOne(parseInt(id), userId);
    const productResponse = this.productService.mapToResponse(product);
    return productResponse;
  }

  @Post()
  async create(@Body() body: CreateProductDTO, @User() user: UserEntity) {
    const product = await this.productService.create(body, user);
    const productResponse = this.productService.mapToResponse(product);
    return productResponse;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: string,
    @User('id') userId: number,
    @Body() body: CreateProductDTO,
  ) {
    await this.productService.update(parseInt(id), userId, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @User('id') userId: number) {
    await this.productService.delete(parseInt(id), userId);
  }
}
