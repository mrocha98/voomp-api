import {
  ProductBillingType,
  ProductCategory,
  ProductType,
} from 'src/enums/product';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'enum', enum: ProductCategory })
  category: ProductCategory;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @Column({ type: 'smallint' })
  warrantyInDays: number;

  @Column({ type: 'numeric', precision: 19, scale: 4 })
  price: number;

  @Column({ type: 'enum', enum: ProductBillingType })
  billingType: ProductBillingType;

  @ManyToOne(() => UserEntity, (user) => user.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
