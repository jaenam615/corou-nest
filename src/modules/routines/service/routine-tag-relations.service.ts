import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutineTagRelation } from '../entity/routine-tag-relation.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoutineTagRelationsService {
  constructor(
    @InjectRepository(RoutineTagRelation)
    private routineTagRelationRepository: Repository<RoutineTagRelation>,
  ) {}

  async addRoutineTagRelation(
    routine_key: number,
    tag_key: number,
    transactionalEntityManager: EntityManager,
  ): Promise<RoutineTagRelation> {
    const relation = this.routineTagRelationRepository.create({
      routine_key,
      tag_key,
    });
    const savedRelation = await transactionalEntityManager.save(
      RoutineTagRelation,
      relation,
    );
    return savedRelation;
  }
}
