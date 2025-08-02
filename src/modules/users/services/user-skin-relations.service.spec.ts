import { Test, TestingModule } from '@nestjs/testing';
import { UserSkinRelationsService } from './user-skin-relations.service';

describe('UserSkinRelationsService', () => {
  let service: UserSkinRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSkinRelationsService],
    }).compile();

    service = module.get<UserSkinRelationsService>(UserSkinRelationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
