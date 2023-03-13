import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

const NICKNAME_VALIDATION_REGEX = /^[^\[\]<>^$%.\|/?*+() ]+$/;

export class SetNicknameDTO {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(NICKNAME_VALIDATION_REGEX, { message: 'illegal character' })
  @ApiProperty({
    default: '',
    minLength: 3,
    maxLength: 10,
    pattern: NICKNAME_VALIDATION_REGEX.toString(),
  })
  nickname: string;
}
