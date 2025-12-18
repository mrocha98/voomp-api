import { PaymentMethod } from 'src/enums/sale';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { LeadEntity } from './lead.entity';

@Entity('sales')
@Index(['product', 'isFirst'], { unique: true, where: '"isFirst" = true' })
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ default: false })
  isFirst: boolean;

  @OneToOne(() => LeadEntity, (lead) => lead.sale, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'saleId' })
  lead: LeadEntity;

  @ManyToOne(() => ProductEntity, (product) => product.sales, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
