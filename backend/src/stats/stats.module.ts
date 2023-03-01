import { Module } from '@nestjs/common';
import { StatsService } from 'src/stats/stats.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatsController } from './stats.controller';

@Module({
    providers: [StatsService],
    controllers: [StatsController],
    imports: [PrismaModule],
})
export class StatsModule {}
