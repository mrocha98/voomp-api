import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductVisitEntity } from './product-visit.entity';
import { SaleEntity } from './sale.entity';

@Entity('leads')
export class LeadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ProductVisitEntity, (visit) => visit.lead, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visitId' })
  visit: ProductVisitEntity;

  @OneToOne(() => SaleEntity, (sale) => sale.lead)
  sale: SaleEntity;

  @ManyToOne(() => ProductEntity, (product) => product.leads, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
