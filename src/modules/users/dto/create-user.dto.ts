import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/common/enum/gender.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: '이메일',
    example: 'corou@corou.shop',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '비밀번호',
    example: 'password123@',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자 닉네임',
    example: '새까만닭',
  })
  username: string;

  @IsDate()
  @ApiProperty({
    description: '생년월일',
    example: '1998-01-01',
  })
  birth_date: Date;

  @IsEnum(Gender)
  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: 'M',
  })
  gender: Gender;

  @ApiProperty({
    description: '피부타입',
    example: [1, 7, 10, 11],
  })
  attributes: number[];

  constructor(init?: Partial<CreateUserDto>) {
    Object.assign(this, init);
  }
}
