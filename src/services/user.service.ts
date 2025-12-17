import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { UserResponseDTO } from 'src/dtos/user-response.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { PasswordHashService } from './password-hash.service';
import { LoginDTO } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { GetPendingStepsResponseDTO } from 'src/dtos/get-pending-steps-response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateUserDTO) {
    const parsedCpf = user.cpf.replaceAll(/[-.]/g, '');
    const cpfInUse = await this.userRepository.checkCPFInUse(parsedCpf);
    if (cpfInUse) {
      throw new BadRequestException('cpf já está em uso');
    }

    const emailInUse = await this.userRepository.checkEmailInUse(user.email);
    if (emailInUse) {
      throw new BadRequestException('email já está em uso');
    }

    const parsedPhoneNumber = user.phoneNumber.replaceAll(/\D/g, '');
    const phoneNumberInUse = await this.userRepository.checkPhoneNumberInUse(
      user.email,
    );
    if (phoneNumberInUse) {
      throw new BadRequestException('telefone já está em uso');
    }

    const hashedPassword = await this.passwordHashService.hash(user.password);

    const createdUser = await this.userRepository.create({
      ...user,
      cpf: parsedCpf,
      phoneNumber: parsedPhoneNumber,
      password: hashedPassword,
    });
    return createdUser;
  }

  mapToResponse(user: UserEntity): UserResponseDTO {
    return plainToClass(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
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
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async getPendingSteps(userId: number) {
    const [hasProducts, hasSales] = await Promise.all([
      this.userRepository.checkHasProducts(userId),
      this.userRepository.checkHasSales(userId),
    ]);

    const pendingSteps = {
      hasPersonalData: true, // mocked by now
      hasIdentityValidated: false, // mocked by now
      hasBusinessData: false, // mocked by now
      hasProducts,
      hasSales,
    };

    return plainToClass(GetPendingStepsResponseDTO, pendingSteps);
  }

  async getWhatsappAlertsStatus(userId: number) {
    const user = await this.userRepository.findById(userId);
    return { active: user!.whatsappAlertsActivated };
  }
}
