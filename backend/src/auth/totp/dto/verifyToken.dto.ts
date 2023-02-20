import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDTO {
  @ApiProperty()
  token: string;
}
