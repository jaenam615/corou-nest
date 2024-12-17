import { Module } from '@nestjs/common';
import { RoutineDetailsService } from '../routines/service/routine-details.service';

@Module({
  providers: [RoutineDetailsService]
})
export class RoutineDetailsModule {}
