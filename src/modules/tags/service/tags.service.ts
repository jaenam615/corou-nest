import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(tag_name: string): Promise<number> {
    const tagExists = await this.tagRepository.findOne({ where: { tag_name } });
    if (tagExists) {
      return tagExists.tag_key;
    } else {
      const newTag = this.tagRepository.create({
        tag_name,
      });
      const savedTag = await this.tagRepository.save(newTag);
      return savedTag.tag_key;
    }
  }

  // 피부속성 조회 by key
  async getTagByKey(tag_key: number): Promise<Tag> {
    const tag = await this.tagRepository.findOneBy({ tag_key });
    if (!tag) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }
    return tag;
  }
}
