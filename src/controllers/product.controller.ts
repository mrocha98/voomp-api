import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

import { User } from 'src/decorators/user.decorator';
import {
  CreateProductApiBodyDTO,
  CreateProductDTO,
} from 'src/dtos/create-product.dto';
import { GetManyProductsDTO } from 'src/dtos/get-many-products.dto';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { ProductService } from 'src/services/product.service';
import { productCoverMulterConfig } from 'src/utils/files/product-image-multer-config';

@ApiBearerAuth('bearerAuth')
@Controller('/products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMany(
    @Query() query: GetManyProductsDTO,
    @User('id') userId: number,
  ) {
    if (query.countOnly) {
      const total = await this.productService.getTotal(userId);
      return this.productService.mapListToResponse([], total);
    }
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductApiBodyDTO })
  @UseInterceptors(FileInterceptor('cover', productCoverMulterConfig))
  async create(
    @Body() body: CreateProductDTO,
    @User('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 })],
        fileIsRequired: false,
      }),
    )
    cover?: Express.Multer.File,
  ) {
    const product = await this.productService.create(body, userId, cover);
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
