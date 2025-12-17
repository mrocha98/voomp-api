import { IAPromptType } from 'src/enums/ia';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ia_prompts')
export class IAPromptsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: IAPromptType })
  type: IAPromptType;

  @Column()
  prompt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
