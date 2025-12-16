import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { UserOnboardingEntity } from 'src/entities/user-onboarding.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserOnboardingEntity)
    private readonly userOnboardingRepository: Repository<UserOnboardingEntity>,
  ) {}

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(user: CreateUserDTO): Promise<UserEntity> {
    const onboarding = await this.userOnboardingRepository.save(
      user.onboarding,
    );
    return await this.userRepository.save({ ...user, onboarding });
  }

  async checkCPFInUse(cpf: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ cpf });
    return !!user;
  }

  async checkEmailInUse(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async checkPhoneNumberInUse(phoneNumber: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ phoneNumber });
    return !!user;
  }
}
