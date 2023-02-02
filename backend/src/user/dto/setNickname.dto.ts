import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class SetNicknameDTO {
  @IsNotEmpty()
  @Length(3, 32)
  @ApiProperty({
    default: '',
    minLength: 3,
    maxLength: 32,
  })
  nickname: string;
}
