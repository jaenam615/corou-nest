import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Gender } from '../../../common/enum/gender.enum';
import { Review } from '../../reviews/entity/review.entity';
import { RoutineDetail } from './routine-detail.entity';
import { RoutineSkinRelation } from './routine-skin-relation.entity';
import { RoutineTagRelation } from './routine-tag-relation.entity';

@Entity('routine')
export class Routine {
  @PrimaryGeneratedColumn()
  routine_key!: number;

  @Column({ type: 'varchar', length: 255 })
  routine_name!: string;

  @Column({ type: 'int' })
  steps!: number;

  @Column({ type: 'char', length: 1 })
  for_gender!: Gender;

  @Column({ type: 'int' })
  for_age!: number;

  @Column({ type: 'float', default: 0 })
  average_rating?: number;

  @Column({ type: 'int' })
  price_total!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_key' })
  user!: User;

  @OneToMany(() => Review, (review) => review.routine, { cascade: true })
  reviews?: Review[];

  @OneToMany(() => RoutineDetail, (routineDetail) => routineDetail.routine, {
    cascade: true,
  })
  routineDetails?: RoutineDetail[];

  @OneToMany(
    () => RoutineSkinRelation,
    (routineSkinRelation) => routineSkinRelation.routine,
    { cascade: true },
  )
  routine_skin_relations?: RoutineSkinRelation[];

  @OneToMany(
    () => RoutineTagRelation,
    (routineTagRelation) => routineTagRelation.routine,
    { cascade: true },
  )
  routine_tag_relations?: RoutineTagRelation[];
}
