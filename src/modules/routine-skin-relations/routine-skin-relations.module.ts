import { Module } from '@nestjs/common';
import { RoutineSkinRelationsService } from './service/routine-skin-relations.service';

@Module({
  providers: [RoutineSkinRelationsService]
})
export class RoutineSkinRelationsModule {}
