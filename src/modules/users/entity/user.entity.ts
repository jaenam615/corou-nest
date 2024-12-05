import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_key!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'date' })
  birth_date!: Date;

  @Column({ type: 'char', length: 1 })
  gender!: 'M' | 'F';

  @OneToMany(() => Routine, (routine) => routine.user)
  routines?: Routine[];

  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @OneToMany(() => ItemOrder, (itemOrder) => itemOrder.user)
  itemOrders?: ItemOrder[];

  @OneToMany(() => Review, (review) => review.user)
  reviews?: Review[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts?: Cart[];
}
