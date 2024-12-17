import 'reflect-metadata';
import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Routine } from './routine.entity';
import { Tag } from '../../tags/entity/tag.entity';

@Entity('routine_tag_relation')
export class RoutineTagRelation {
  @PrimaryColumn()
  routine_key!: number;

  @PrimaryColumn()
  tag_key!: number;

  @ManyToOne(() => Routine, (routine) => routine.routine_tag_relations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routine_key' })
  routine!: Routine;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_key' })
  tag!: Tag;
}
