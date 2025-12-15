import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { CreateUserResponseDTO } from 'src/dtos/response-create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user-repository';
import { PasswordHashService } from './password-hash.service';
import { LoginDTO } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateUserDTO) {
    const cpfInUse = await this.userRepository.checkCPFInUse(user.cpf);
    if (cpfInUse) {
      throw new BadRequestException('cpf já está em uso');
    }
    const emailInUse = await this.userRepository.checkEmailInUse(user.email);
    if (emailInUse) {
      throw new BadRequestException('email já está em uso');
    }
    const phoneNumberInUse = await this.userRepository.checkPhoneNumberInUse(
      user.email,
    );
    if (phoneNumberInUse) {
      throw new BadRequestException('telefone já está em uso');
    }

    const hashedPassword = await this.passwordHashService.hash(user.password);

    const createdUser = await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    return createdUser;
  }

  mapCreateToResponse(user: UserEntity): CreateUserResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return plainToClass(CreateUserResponseDTO, user);
  }

  async login({ email, password }: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatches = await this.passwordHashService.verify(
      user.password,
      password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
