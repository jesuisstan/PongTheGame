import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class StatusController {
  @Get('/healthcheck')
  @ApiOperation({ summary: 'Check whether the application is up and running' })
  @ApiTags('Docker')
  async status() {
    return 'up and running!';
  }
}
