import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class StatusController {
  @Get('/healthcheck')
  @ApiOperation({ summary: 'Check whether the application is up and running' })
  async status() {
    return 'up and running!';
  }
}
