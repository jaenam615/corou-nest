import { Test, TestingModule } from '@nestjs/testing';

import { RoutineSkinRelationsService } from './routine-skin-relations.service';

describe('RoutineSkinRelationsService', () => {
  let service: RoutineSkinRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutineSkinRelationsService],
    }).compile();

    service = module.get<RoutineSkinRelationsService>(
      RoutineSkinRelationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
