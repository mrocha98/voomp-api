import { Body, Controller, Post } from '@nestjs/common';
import { IAService } from 'src/services/ia.service';
import { IAPromptsEntity } from 'src/entities/ia-prompts.entity';

@Controller('ia')
export class IAController {
  constructor(private readonly iaService: IAService) {}

  @Post('optimize-title')
  async optimizeTitle(
    @Body() body: { title: string; category?: string }
  ): Promise<{ optimizedTitle: string }> {
    const result = await this.iaService.optimizeTitle(body.title, body.category);
    return { optimizedTitle: result };
  }

  @Post('optimize-descriptor')
  async optimizeDescriptor(
    @Body() body: { descriptor: string; category?: string; keywords?: string[] }
  ): Promise<{ optimizedDescriptor: string }> {
    const result = await this.iaService.optimizeDescriptor(
      body.descriptor,
      body.category,
      body.keywords
    );
    return { optimizedDescriptor: result };
  }

  @Post('prompts/title')
  async createPromptTitle(
    @Body() body: { prompts: string[] }
  ): Promise<IAPromptsEntity[]> {
    return await this.iaService.createPromptTitle(body.prompts);
  }

  @Post('prompts/descriptor')
  async createPromptDescriptor(
    @Body() body: { prompts: string[] }
  ): Promise<IAPromptsEntity[]> {
    return await this.iaService.createPromptDescriptor(body.prompts);
  }
}