import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Goal, HowKnew } from 'src/enums/user-onboarding';

@Entity('users-onboarding')
export class UserOnboardingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: HowKnew, nullable: true })
  howKnew?: HowKnew | null;

  @Column({ type: 'boolean', nullable: true })
  alreadySellOnline?: boolean;

  @Column({ type: 'enum', enum: Goal, nullable: true })
  goal?: Goal;

  @OneToOne(() => UserEntity, (user) => user.onboarding)
  user: UserEntity;
}
