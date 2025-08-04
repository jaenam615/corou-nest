import { Test, TestingModule } from '@nestjs/testing';

import { RoutineTagRelationsService } from './routine-tag-relations.service';

describe('RoutineTagRelationsService', () => {
  let service: RoutineTagRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutineTagRelationsService],
    }).compile();

    service = module.get<RoutineTagRelationsService>(
      RoutineTagRelationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
