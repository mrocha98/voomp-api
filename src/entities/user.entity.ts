import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserOnboardingEntity } from './user-onboarding.entity';

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

  @OneToOne(() => UserOnboardingEntity, (onboarding) => onboarding.user)
  @JoinColumn()
  onboarding: UserOnboardingEntity;
}
