import { Controller, Get } from '@nestjs/common';

@Controller()
export class StatusController {
  @Get('/healthcheck')
  async status() {
    return 'up and running!';
  }
}
