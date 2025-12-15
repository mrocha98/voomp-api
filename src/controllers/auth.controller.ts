import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { LoginDTO } from 'src/dtos/login.dto';
import { UserService } from 'src/services/user.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDTO) {
    const user = await this.userService.create(body);
    const userResponse = this.userService.mapCreateToResponse(user);
    return userResponse;
  }

  @Post('/login')
  async login(@Body() body: LoginDTO) {
    const token = await this.userService.login(body);
    return token;
  }
}
