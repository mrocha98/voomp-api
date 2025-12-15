import { Body, Controller, Param, Post } from '@nestjs/common';
import { GetGenerationCodeDTO } from 'src/dtos/get-generation-code.dto';
import { EmailService } from 'src/services/email.service';
import { GenerationCodeService } from 'src/services/generation-code.service';

@Controller("generation-code")
export class GenerationCodeController {
  constructor(
    private readonly generationCode: GenerationCodeService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async getGenerationCode(@Body() body: GetGenerationCodeDTO) {
    const code = await this.generationCode.getGenerationCode(body);
    await this.emailService.sendEmail(
      body.email,
      'Código de confirmação Voomp',
      `Seu código é:\n${code.code}`,
    );
  }

  @Post('use/:code')
  async useGenerationCode(@Param('code') code: string): Promise<any> {
    return await this.generationCode.useGenerationCode(code);
  }
}
