import { Body, Controller, Post } from '@nestjs/common';
import { IAService } from 'src/services/ia.service';

@Controller('ia')
export class IAController {
  constructor(private readonly iaService: IAService) {}

  @Post('/optimize-title')
  async optimizeTitle(@Body('content') content: string): Promise<any> {
    return this.iaService.message(content);
  }

  @Post('/optimize-descriptor')
  async optimizeDescriptor(@Body('content') content: string): Promise<any> {
    return this.iaService.message(content);
  }  
}
