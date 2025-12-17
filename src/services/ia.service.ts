import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Config } from 'src/config';
import { IAPromptRepository } from 'src/repositories/ia-prompts.repository';
import { IAPromptsEntity } from 'src/entities/ia-prompts.entity';

@Injectable()
class IAService {
  constructor(
    private readonly httpService: HttpService,
    private readonly iaPromptRepository: IAPromptRepository
  ) {}

  async token(): Promise<string> {
    const data = new URLSearchParams({
      client_id: Config.ia.client_id,
      grant_type: Config.ia.grant_type,
      username: Config.ia.username,
      password: Config.ia.password,
    });

    const response = await firstValueFrom(
      this.httpService.post(Config.ia.token_url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return response.data.access_token;
  }

  async message(content: string): Promise<any> {
    const token = await this.token();
    const data = {
      messages: [
        {
          "role": "user",
          "content": content
        }
      ],
      properties: {
        temperature: 0.5,
        topK: 5,
        stream: false,
        formatStreamResponse: false,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(Config.ia.message_url, data, {
        headers: {
          'X-Request-Origin': 'COGNA_DOCENTE_SABER',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    const [responseData] = response.data;
    return { message: responseData.message.content };
  }

  async optimizeTitle(title: string, category?: string): Promise<string> {
    const promptsFromTitle = await this.iaPromptRepository.findByTitle();
    const prompts = promptsFromTitle.map((prompt) => prompt.prompt);

    const prompt = [
      `Otimize este título de produto para SEO e conversão:`,
      `Título original: "${title}"`,
      `${category ? `Categoria: ${category}` : ''}`,
      `Critérios:`, ...prompts,
      `Retorne apenas o título otimizado:`
    ].join('\n');

    console.log(prompt);
    
    const response = await this.message(prompt);
    return response.message;
  }
  
  async optimizeDescriptor(descriptor: string, category?: string, keywords?: string[]): Promise<string> {
    const promptsFromDescriptor = await this.iaPromptRepository.findByDescriptor();
    const prompts = promptsFromDescriptor.map((prompt) => prompt.prompt);

    const keywordText = keywords?.length ? `\nPalavras-chave: ${keywords.join(', ')}` : '';
    const prompt = [
      `Otimize esta descrição de produto para SEO:`,
      `Descrição original: "${descriptor}"`,
      `${category ? `Categoria: ${category}` : ''}${keywordText}`,
      `Critérios:`, ...prompts,
      `Retorne apenas a descrição otimizada:`      
    ].join('\n');
    
    const response = await this.message(prompt);
    return response.message;
  }

  async createPromptTitle(prompts: string[]): Promise<IAPromptsEntity[]> {
    return await this.iaPromptRepository.createPromptTitle(prompts);
  }

  async createPromptDescriptor(prompts: string[]): Promise<IAPromptsEntity[]> {
    return await this.iaPromptRepository.createPromptDescriptor(prompts);
  }
}

export { IAService };
