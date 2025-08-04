import { Controller, Get, Param } from '@nestjs/common';

import { TagsService } from '../service/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('/:tag_key')
  async getTagByKey(@Param('tag_key') tag_key: number) {
    try {
      const tag = await this.tagsService.getTagByKey(tag_key);
      return {
        success: true,
        message: '태그 조회 성공',
        data: tag.tag_name,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }
}
