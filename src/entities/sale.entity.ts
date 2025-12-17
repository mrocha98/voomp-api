import { PaymentMethod } from 'src/enums/sale';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { LeadEntity } from './lead.entity';

@Entity('sales')
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

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
