import { Controller, Param, Post } from '@nestjs/common';
import { GenerationCodeService } from 'src/services/generation-code.service';

@Controller('generation-code')
export class GenerationCodeController {
  constructor(private readonly GenerationCode: GenerationCodeService) {}

  @Post()
  async getGenerationCode(): Promise<any> {
    return await this.GenerationCode.getGenerationCode();
  }

  @Post('use/:code')
  async useGenerationCode(@Param('code') code: string): Promise<any> {
    return await this.GenerationCode.useGenerationCode(code);
  }
}
