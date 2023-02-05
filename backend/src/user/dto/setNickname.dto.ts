import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class SetNicknameDTO {
  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty({
    default: '',
    minLength: 3,
    maxLength: 20,
  })
  nickname: string;
}
