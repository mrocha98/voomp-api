import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { SaleService } from 'src/services/sale.service';

@ApiBearerAuth('bearerAuth')
@Controller('/sales')
@UseGuards(AuthGuard)
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('/total')
  async getTotal(@User('id') userId: number) {
    return await this.saleService.getTotal(userId);
  }

  @Get('/statistics')
  async getStatistics(@User('id') userId: number) {
    return await this.saleService.getStatistics(userId);
  }

  @Get('/revenue')
  async getRevenue(@User('id') userId: number) {
    return await this.saleService.getRevenue(userId);
  }
}
