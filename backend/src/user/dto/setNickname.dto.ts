import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

const NICKNAME_VALIDATION_REGEX = /^[A-zA-Z0-9_-]+$/;
const MIN_LENGTH = 3 as const;
const MAX_LENGTH = 10 as const;

export class SetNicknameDTO {
  @IsString()
  @Length(MIN_LENGTH, MAX_LENGTH)
  @Matches(NICKNAME_VALIDATION_REGEX, { message: 'illegal character' })
  @ApiProperty({
    default: '',
    minLength: MIN_LENGTH,
    maxLength: MAX_LENGTH,
    pattern: NICKNAME_VALIDATION_REGEX.toString(),
  })
  nickname: string;
}
