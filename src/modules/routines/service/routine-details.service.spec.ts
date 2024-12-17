import { Test, TestingModule } from '@nestjs/testing';
import { RoutineDetailsService } from './routine-details.service';

describe('RoutineDetailsService', () => {
  let service: RoutineDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutineDetailsService],
    }).compile();

    service = module.get<RoutineDetailsService>(RoutineDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
