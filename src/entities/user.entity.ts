import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserOnboardingEntity } from './user-onboarding.entity';
import { ProductEntity } from './product.entity';
import { UserBusinessDataEntity } from './user-business-data.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  whatsappAlertsActivated: boolean;

  @Column({ type: 'boolean', default: false })
  hasIdentityValidated: boolean;

  @OneToOne(() => UserOnboardingEntity, (onboarding) => onboarding.user)
  @JoinColumn()
  onboarding: UserOnboardingEntity;

  @OneToOne(() => UserBusinessDataEntity, (businessData) => businessData.user)
  @JoinColumn()
  businessData: UserBusinessDataEntity;

  @OneToMany(() => ProductEntity, (product) => product.user)
  products: ProductEntity[];
}
