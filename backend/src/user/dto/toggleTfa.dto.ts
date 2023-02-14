import { ApiProperty } from '@nestjs/swagger';

export class ToggleTfaDTO {
  @ApiProperty()
  enabled: boolean;
}
