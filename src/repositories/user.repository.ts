import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/dtos/create-user.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { SaleEntity } from 'src/entities/sale.entity';
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
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ phoneNumber });
  }

  async create(user: CreateUserDTO): Promise<UserEntity> {
    const onboarding = await this.userOnboardingRepository.save(
      user.onboarding,
    );
    return await this.userRepository.save({ ...user, onboarding });
  }

  async checkCPFInUse(cpf: string): Promise<boolean> {
    return await this.userRepository.existsBy({ cpf });
  }

  async checkEmailInUse(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email });
  }

  async checkPhoneNumberInUse(phoneNumber: string): Promise<boolean> {
    return await this.userRepository.existsBy({ phoneNumber });
  }

  async checkHasProducts(userId: number): Promise<boolean> {
    return await this.productRepository.exists({
      where: { user: { id: userId } },
    });
  }

  async checkHasSales(userId: number): Promise<boolean> {
    const saleExists = await this.saleRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .where('product.userId = :userId', { userId })
      .select('1')
      .limit(1)
      .getRawOne<object>();

    return !!saleExists;
  }

  async updateWhatsappAlertsActivated(id: number, activated: boolean) {
    await this.userRepository.update(
      { id },
      { whatsappAlertsActivated: activated },
    );
  }

  async getMorningCallUsers() {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.products', 'product')
      .where('user.whatsappAlertsActivated = :activated', { activated: true })
      .getMany();
  }
}
