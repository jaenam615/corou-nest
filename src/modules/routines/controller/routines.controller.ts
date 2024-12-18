import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { RoutinesService } from '../service/routines.service';
import { RoutineDetailsService } from '../service/routine-details.service';
import { BaseRoutineDto } from '../dto/baseRoutine.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation } from '@nestjs/swagger';
import { Order } from '../../../common/enum/order.enum';

@Controller('routines')
export class RoutinesController {
  constructor(
    private readonly routinesService: RoutinesService,
    private readonly routineDetailService: RoutineDetailsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: '루틴 생성' })
  async createRoutine(
    @Headers('authorization') token: string,
    @Body() body: BaseRoutineDto,
  ) {
    const checkToken = this.jwtService.verify(token.split(' ')[1]);
    if (!checkToken) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }
    const user_key = checkToken['user_key'];
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
  @ApiOperation({ summary: '루틴 수정' })
  async updateRoutine(
    @Param('routine_key') routine_key: number,
    @Headers('authorization') token: string,
    @Body() body: BaseRoutineDto,
  ) {
    const checkToken = this.jwtService.verify(token.split(' ')[1]);
    if (!checkToken) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }
    const user_key = checkToken['user_key'];
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
  @ApiOperation({ summary: '루틴 삭제' })
  async deleteRoutine(@Param('routine_key') routine_key: number) {
    try {
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
