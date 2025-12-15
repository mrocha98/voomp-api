import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn, 
  UpdateDateColumn
} from 'typeorm';

@Entity("generation_code")
export class GenerationCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 6 })
  code: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}