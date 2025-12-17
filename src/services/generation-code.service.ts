import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerationCodeEntity } from 'src/entities/generation-code.entity';
import { GetGenerationCodeDTO } from 'src/dtos/get-generation-code.dto';
import { UseGenerationCodeDTO } from 'src/dtos/use-generation-code.dto';

@Injectable()
class GenerationCodeService {
  constructor(
    @InjectRepository(GenerationCodeEntity)
    private readonly generationRepository: Repository<GenerationCodeEntity>,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async getGenerationCode({
    email,
  }: GetGenerationCodeDTO): Promise<GenerationCodeEntity> {
    const existentCode = await this.generationRepository.findOneBy({ email });

    if (existentCode) {
      if (existentCode.isActive) {
        return existentCode;
      }
      const refreshCode = this.generateCode();
      existentCode.code = refreshCode;
      await this.generationRepository.update({ email }, existentCode);
      return existentCode;
    }

    return await this.generationRepository.save(
      this.generationRepository.create({
        code: this.generateCode(),
        email,
      }),
    );
  }

  async useGenerationCode(
    code: string,
    { email }: UseGenerationCodeDTO,
  ): Promise<GenerationCodeEntity | boolean> {
    const generationCode = await this.generationRepository.findOne({
      where: { code, email },
    });

    if (generationCode === null) {
      throw new ForbiddenException('GenerationCode invalid');
    }

    if (generationCode.isActive === true) {
      return true;
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
