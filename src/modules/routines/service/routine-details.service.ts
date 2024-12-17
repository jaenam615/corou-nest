import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoutineDetail } from '../entity/routine-detail.entity';
import { ItemsService } from 'src/modules/items/service/items.service';

@Injectable()
export class RoutineDetailsService {
  constructor(
    @InjectRepository(RoutineDetail)
    private readonly routineDetailsRepository: Repository<RoutineDetail>,
    private readonly itemsService: ItemsService,
  ) {}

  // 루틴 단계 생성
  async createRoutineDetail(
    step_number: number,
    routine_key: number,
    item_key: number,
    step_name: string,
    description: string,
    transactionalEntityManager: EntityManager,
  ): Promise<RoutineDetail> {
    console.log(step_number, routine_key, item_key, step_name, description);
    const item = await this.itemsService.getItemByKey(item_key);
    console.log(item);
    if (!item) {
      throw new Error('해당 아이템을 찾을 수 없습니다.');
    }
    const routineDetail = this.routineDetailsRepository.create({
      step_number,
      routine_key,
      item,
      step_name,
      description,
    });
    try {
      const savedDetail = await transactionalEntityManager.save(
        RoutineDetail,
        routineDetail,
      );
      return savedDetail;
    } catch (error) {
      console.error('Error saving routine detail:', error);
      throw error;
    }
  }

  // 루틴 상세 조회
  async getAllRoutineDetails(routine_key: number) {
    const routineDetails = await this.routineDetailsRepository.find({
      where: { routine: { routine_key } },
    });
    if (!routineDetails.length) {
      throw new Error('해당 루틴의 상세 정보를 찾을 수 없습니다.');
    }
    return routineDetails;
  }

  // 루틴 상세 수정
  async updateRoutineDetail(
    step_number: number,
    routine_key: number,
    item_key: number,
    step_name: string,
    description: string,
    transactionalEntityManager: EntityManager,
  ) {
    const routineDetail = await this.routineDetailsRepository.findOne({
      where: { step_number, routine_key },
      relations: ['item'],
    });
    if (!routineDetail) {
      throw new Error('해당 루틴 상세 정보를 찾을 수 없습니다.');
    }
    if (item_key !== routineDetail.item.item_key) {
      const item = await this.itemsService.getItemByKey(item_key);
      if (!item) {
        throw new Error('해당 아이템을 찾을 수 없습니다.');
      }
      routineDetail.item_key = item_key;
      routineDetail.item = item;
    }
    routineDetail.step_name = step_name;
    routineDetail.description = description;

    return await this.routineDetailsRepository.save(routineDetail);
  }

  // 루틴 상세 삭제
  async deleteRoutineDetail(step_number: number, routine_key: number) {
    const routineDetail = await this.routineDetailsRepository.findOne({
      where: { step_number, routine: { routine_key } },
    });
    if (!routineDetail) {
      throw new Error('해당 루틴 상세 정보를 찾을 수 없습니다.');
    }
    return await this.routineDetailsRepository.remove(routineDetail);
  }
}
