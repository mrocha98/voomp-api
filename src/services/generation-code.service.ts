import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerationCodeEntity } from 'src/entities/generation-code.entity';

@Injectable()
class GenerationCodeService {
  constructor(
    @InjectRepository(GenerationCodeEntity)
    private readonly generationRepository: Repository<GenerationCodeEntity>,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async getGenerationCode(): Promise<GenerationCodeEntity> {
    return await this.generationRepository.save(
      this.generationRepository.create({
        code: this.generateCode(),
      }),
    );
  }

  async useGenerationCode(
    code: string,
  ): Promise<GenerationCodeEntity | boolean> {
    const generationCode = await this.generationRepository.findOne({
      where: { code: code },
    });

    if (generationCode === null) {
      throw new ForbiddenException('GenerationCode invalid');
    }

    if (generationCode.isActive === true) {
      throw new ForbiddenException('GenerationCode already in use');
    }

    await this.generationRepository.update(
      {
        id: generationCode?.id,
      },
      { isActive: true },
    );

    return await this.generationRepository.findOneOrFail({
      where: { code: code },
    });
  }
}

export { GenerationCodeService };
