import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class VerifyTokenDTO {
  @ApiProperty()
  @IsDefined()
  token: string;
}
