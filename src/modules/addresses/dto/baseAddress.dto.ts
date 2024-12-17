import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class BaseAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '배송지 이름',
    example: '집',
  })
  address_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '수취인 이름',
    example: '홍길동',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '주소',
    example: '서울시 강남구 역삼동 123-456',
  })
  addr: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '상세주소',
    example: '강남빌딩 123호',
  })
  addr_detail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '우편번호',
    example: '12345',
  })
  zip: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '전화번호',
    example: '01012345678',
  })
  tel: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '요청사항',
    example: '부재시 경비실에 맡겨주세요.',
  })
  request: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '기본배송지 여부',
    example: 'Y',
  })
  is_default: 'Y' | 'N';
}
