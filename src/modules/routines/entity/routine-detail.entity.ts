import 'reflect-metadata';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Routine } from './routine.entity';
import { Item } from '../../items/entity/item.entity';

@Entity('routine_detail')
export class RoutineDetail {
  @PrimaryColumn()
  step_number!: number;

  @PrimaryColumn()
  routine_key!: number;

  @Column()
  item_key!: number;

  @Column({ type: `varchar`, length: 255 })
  step_name!: string;

  @Column({ type: `varchar`, length: 255 })
  description?: string;

  @ManyToOne(() => Routine, (routine) => routine.routineDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routine_key' })
  routine!: Routine;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_key' })
  item!: Item;
}
