import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSkinRelation } from 'src/modules/users/entities/user-skin-relation.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserSkinRelationsService {
  constructor(
    @InjectRepository(UserSkinRelation)
    private readonly userSkinRelationRepository: Repository<UserSkinRelation>,
    private dataSource: DataSource,
  ) {}

  async addUserSkinRelation(
    user_key: number,
    attr_key: number,
    transactionalEntityManager: EntityManager,
  ): Promise<UserSkinRelation> {
    const relation = this.userSkinRelationRepository.create({
      user_key,
      attr_key,
    });
    return transactionalEntityManager.save(UserSkinRelation, relation);
  }

  async updateUserSkinRelation(
    user_key: number,
    attr_key: number[],
  ): Promise<void> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      await this.userSkinRelationRepository.delete({ user_key });
      for (const attr of attr_key) {
        await this.addUserSkinRelation(
          user_key,
          attr,
          transactionalEntityManager,
        );
      }
    });
  }
}
