import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { Order } from '../../../common/enum/order.enum';
import { BaseRoutineDto } from '../dto/baseRoutine.dto';
import { RoutineDetailsService } from '../service/routine-details.service';
import { RoutinesService } from '../service/routines.service';

@Controller('routines')
export class RoutinesController {
  constructor(
    private readonly routinesService: RoutinesService,
    private readonly routineDetailService: RoutineDetailsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '루틴 생성' })
  async createRoutine(@Request() req, @Body() body: BaseRoutineDto) {
    const user_key = req.user.user_key;
    try {
      const routine = await this.routinesService.createRoutine(user_key, body);
      return {
        success: true,
        message: '루틴 생성 성공',
        data: routine,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get()
  @ApiOperation({ summary: '모든 루틴 조회' })
  async getAllRoutines(
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query() filter: any,
  ) {
    try {
      Object.keys(filter).forEach((key) => {
        if (!Array.isArray(filter[key])) {
          filter[key] = [filter[key] as string];
        }
      });

      const routines = await this.routinesService.getAllRoutines(
        sort as string,
        order as Order,
        page ? page : undefined,
        size ? size : undefined,
        filter as { [key: string]: any },
      );

      return {
        success: true,
        message: '루틴 조회 성공',
        data: routines,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('/:routine_key')
  @ApiOperation({ summary: '루틴 조회' })
  async getRoutineByKey(@Param('routine_key') routine_key: number) {
    try {
      const routine = await this.routinesService.getRoutineByKey(routine_key);
      return {
        success: true,
        message: '루틴 조회 성공',
        data: routine,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Put('/:routine_key')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '루틴 수정' })
  async updateRoutine(
    @Request() req,
    @Param('routine_key') routine_key: number,
    @Body() body: BaseRoutineDto,
  ) {
    const user_key = req.user.user_key;
    try {
      const routine = await this.routinesService.updateRoutine(
        routine_key,
        user_key,
        body,
      );
      return {
        success: true,
        message: '루틴 수정 성공',
        data: routine,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Delete('/:routine_key')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '루틴 삭제' })
  async deleteRoutine(
    @Request() req,
    @Param('routine_key') routine_key: number,
  ) {
    try {
      await this.routinesService.getRoutineByKey(routine_key);
      if (routine_key !== req.user.user_key) {
        throw new UnauthorizedException('권한이 없습니다.');
      }
      await this.routinesService.deleteRoutine(routine_key);
      return {
        success: true,
        message: '루틴 삭제 성공',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Delete('/:routine_key/detail/:step_number')
  @ApiOperation({ summary: '루틴 상세 삭제' })
  async deleteRoutineDetail(
    @Param('routine_key') routine_key: number,
    @Param('step_number') step_number: number,
  ) {
    try {
      await this.routineDetailService.deleteRoutineDetail(
        routine_key,
        step_number,
      );
      return {
        success: true,
        message: '루틴 상세 삭제 성공',
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('/search/:query')
  @ApiOperation({ summary: '루틴 검색' })
  async searchRoutine(@Param('query') query: string) {
    try {
      const routines = await this.routinesService.searchRoutine(query);
      return {
        success: true,
        data: routines,
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
