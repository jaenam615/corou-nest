import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'address key',
  })
  address_key: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'total price',
  })
  price_total: number;

  @IsArray()
  @ApiProperty({
    example: [
      {
        item_key: 1,
        count: 1,
        purchase_price: 10000,
      },
    ],
    description: 'item keys',
  })
  items: {
    item_key: number;
    count: number;
    purchase_price: number;
  }[];
}
