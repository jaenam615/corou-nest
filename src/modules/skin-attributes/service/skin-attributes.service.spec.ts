import { Test, TestingModule } from '@nestjs/testing';

import { SkinAttributesService } from './skin-attributes.service';

describe('SkinAttributesService', () => {
  let service: SkinAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkinAttributesService],
    }).compile();

    service = module.get<SkinAttributesService>(SkinAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
