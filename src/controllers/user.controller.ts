import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { UpdateUserIdentityValidationDTO } from 'src/dtos/update-user-identity-validation.dto';
import { AuthGuard } from 'src/guards/auth-guard.guard';
import { UserService } from 'src/services/user.service';

@ApiBearerAuth('bearerAuth')
@Controller('/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/pending-steps')
  async getPendingSteps(@User('id') userId: number) {
    return await this.userService.getPendingSteps(userId);
  }

  @Get('/whatsapp-alerts/status')
  async getWhatsappAlertsStatus(@User('id') userId: number) {
    return await this.userService.getWhatsappAlertsStatus(userId);
  }

  @Patch('/identity-validation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserIdentityValidation(
    @User('id') userId: number,
    @Body() body: UpdateUserIdentityValidationDTO,
  ) {
    await this.userService.updateUserIdentityValidation(userId, body.valid);
  }

  @Post('/business-data')
  async addBusinessData(@User('id') userId: number) {
    await this.userService.addBusinessData(userId);
  }
}
