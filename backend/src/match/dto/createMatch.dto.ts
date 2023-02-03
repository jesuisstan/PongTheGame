import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMatchDTO {
  @ApiProperty()
  @IsInt()
  user1: number;

  @ApiProperty()
  @IsInt()
  user2: number;
}
