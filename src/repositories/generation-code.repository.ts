import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerationCodeEntity } from 'src/entities/generation-code.entity';

@Injectable()
class GenerationCodeRepository {
  constructor(
    @InjectRepository(GenerationCodeEntity)
    private readonly generationCode: Repository<GenerationCodeEntity>,
  ) {}

  async getGenerationCode(): Promise<GenerationCodeEntity> {
    return await this.generationCode.save(
      this.generationCode.create({
        code: '123456',
      }),
    );
  }
}

export { GenerationCodeRepository };
