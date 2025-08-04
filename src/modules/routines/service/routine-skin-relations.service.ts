import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RoutineSkinRelation } from '../entity/routine-skin-relation.entity';

@Injectable()
export class RoutineSkinRelationsService {
  constructor(
    @InjectRepository(RoutineSkinRelation)
    private routineSkinRelationRepository: Repository<RoutineSkinRelation>,
  ) {}

  async addRoutineSkinRelation(
    routine_key: number,
    attr_key: number,
    transactionalEntityManager: EntityManager,
  ): Promise<RoutineSkinRelation> {
    const relation = this.routineSkinRelationRepository.create({
      routine_key,
      attr_key,
    });
    return transactionalEntityManager.save(RoutineSkinRelation, relation);
  }
  async getRoutineSkinRelationByAttrKey(
    attr_key: number,
  ): Promise<RoutineSkinRelation[]> {
    return this.routineSkinRelationRepository.find({
      where: {
        attr_key,
      },
    });
  }

  async deleteRoutineSkinRelation(
    routine_key: number,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    await transactionalEntityManager.delete(RoutineSkinRelation, {
      routine_key,
    });
  }
}
