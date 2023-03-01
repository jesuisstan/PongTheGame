import { Controller, Param, Get, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { StatsService } from './stats.service';

@Controller('/stats')
@ApiTags('Statistique')
export class StatsController{
    constructor(private StatsService: StatsService) {}

    @Get('/:id')
    @UseGuards(IsAuthenticatedGuard)
    @ApiOperation({
        summary: 'Get a user stats by its id',
    })
    async getUserStatsById(@Param('id', ParseIntPipe) id: number) {
        return this.StatsService.UserStats(id);
    }
}