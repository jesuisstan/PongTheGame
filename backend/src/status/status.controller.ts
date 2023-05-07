import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class StatusController {
  @Get('/healthcheck')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Check whether the application is up and running' })
  @ApiTags('Docker')
  async status() {
    return 'up and running!';
  }
}
