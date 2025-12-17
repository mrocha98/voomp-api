import {
  ProductBillingType,
  ProductCategory,
  ProductType,
} from 'src/enums/product';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  imageUrl?: string;

  @Column({ type: 'smallint' })
  warrantyInDays: number;

  @Column({ type: 'numeric', precision: 19, scale: 4 })
  price: number;

  @Column({ type: 'enum', enum: ProductBillingType })
  billingType: ProductBillingType;

  @ManyToOne(() => UserEntity, (user) => user.products)
  user: UserEntity;
}
