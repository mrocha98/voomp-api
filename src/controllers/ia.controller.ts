import { Body, Controller, Post } from '@nestjs/common';
import { IAService } from 'src/services/ia.service';

@Controller('ia')
export class IAController {
  constructor(private readonly iaService: IAService) {}

  @Post('/token')
  async token(): Promise<any> {
    const tokem = await this.iaService.token();
    return tokem;
  }

  @Post('/message')
  async login(@Body('content') content: string): Promise<any> {
    return this.iaService.message(content);
  }
}
