import {
  Controller,
  Param,
  Get,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { StatsService } from './stats.service';

@Controller('/stats')
@ApiTags('Statistique')
export class StatsController {
  constructor(private StatsService: StatsService) {}

  @Get('/:Nickname')
  @UseGuards(IsAuthenticatedGuard)
  @ApiOperation({
    summary: 'Get a user stats by its id',
  })
  @ApiResponse({ status: 200, description: 'Succes' })
  @ApiResponse({ status: 400, description: 'User Not found' })
  @ApiResponse({ status: 400, description: 'Stats Not found' })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  async getUserStatsById(@Param('Nickname') Nickname: string) {
    return this.StatsService.UserStats(Nickname);
  }
}
