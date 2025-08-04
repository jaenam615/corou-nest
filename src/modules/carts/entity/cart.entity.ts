import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Item } from '../../items/entity/item.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  cart_key!: number;

  @Column()
  user_key!: number;

  @Column()
  item_key!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_key' })
  user!: User;

  @ManyToOne(() => Item, (item) => item.carts)
  @JoinColumn({ name: 'item_key' })
  item!: Item;
}
