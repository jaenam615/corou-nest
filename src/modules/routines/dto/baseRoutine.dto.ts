import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Gender } from '../../../common/enum/gender.enum';
import { RoutineDetail } from '../entity/routine-detail.entity';

export class BaseRoutineDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '루틴 이름',
    example: '데일리 모닝 루틴',
  })
  routine_name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '루틴 단계 수',
    example: 5,
  })
  steps: number;

  @IsNumber()
  @ApiProperty({
    description: '루틴 대상 연령',
    example: 1,
  })
  for_age: number;

  @IsEnum(Gender)
  @ApiProperty({
    description: '루틴 대상 성별',
    enum: Gender,
    example: 'M',
  })
  for_gender: Gender;

  @IsNumber()
  @ApiProperty({
    description: '루틴 대상 피부타입',
    example: 1,
  })
  for_skin: number;

  @IsArray()
  @ApiProperty({
    description: '루틴 대상 피부문제',
    example: [9, 10],
  })
  for_problem: String[];

  @IsArray()
  @ApiProperty({
    description: '루틴 상세 정보',
    example: [
      {
        step_number: 1,
        item_key: 1,
        step_name: '클렌징',
        description: '클렌징 제품을 손에서 거품을 내 미온수로 세안합니다.',
      },
    ],
  })
  details: RoutineDetail[];

  @IsArray()
  @ApiProperty({
    description: '루틴 태그',
    example: ['클렌징', '모이스처라이저'],
  })
  tags: string[];
}
