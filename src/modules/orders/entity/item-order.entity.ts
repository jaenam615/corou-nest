import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Address } from '../../addresses/entity/address.entity';
import { OrderDetail } from './order-detail.entity';

@Entity('item_order')
export class ItemOrder {
  @PrimaryGeneratedColumn()
  order_key!: number;

  @Column({ type: 'date' })
  order_at!: Date;

  @Column({ type: 'varchar', length: 255 })
  status!: 'ORDERED' | 'CANCELLED' | 'DELIVERED';

  @Column({ type: 'int' })
  price_total!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_key' })
  user!: User;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_key' })
  address!: Address;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.item_order)
  order_details!: OrderDetail[];
}
