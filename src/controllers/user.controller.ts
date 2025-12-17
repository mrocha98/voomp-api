import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
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
}
