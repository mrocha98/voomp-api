import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAPromptsEntity } from 'src/entities/ia-prompts.entity';
import { IAPromptType } from 'src/enums/ia';
import { Repository } from 'typeorm';

@Injectable()
export class IAPromptRepository {
  constructor(
    @InjectRepository(IAPromptsEntity)
    private readonly iaPromptRepository: Repository<IAPromptsEntity>,
  ) {}

  async findByType(type: IAPromptType): Promise<IAPromptsEntity[]> {
    return await this.iaPromptRepository.find({ where: { type } });
  }

  async findByTitle(): Promise<IAPromptsEntity[]> {
    return await this.findByType(IAPromptType.title);
  }

  async findByDescriptor(): Promise<IAPromptsEntity[]> {
    return await this.findByType(IAPromptType.descriptor);
  }

  async createPromptTitle(prompts: string[]): Promise<IAPromptsEntity[]> {
    await this.iaPromptRepository.delete({ type: IAPromptType.title });
    
    const entities = prompts.map(prompt => {
      const iaPrompt = new IAPromptsEntity();
      iaPrompt.type = IAPromptType.title;
      iaPrompt.prompt = prompt;
      return iaPrompt;
    });
    
    return await this.iaPromptRepository.save(entities);
  }

  async createPromptDescriptor(prompts: string[]): Promise<IAPromptsEntity[]> {
    await this.iaPromptRepository.delete({ type: IAPromptType.descriptor });
    
    const entities = prompts.map(prompt => {
      const iaPrompt = new IAPromptsEntity();
      iaPrompt.type = IAPromptType.descriptor;
      iaPrompt.prompt = prompt;
      return iaPrompt;
    });
    
    return await this.iaPromptRepository.save(entities);
  }
}
