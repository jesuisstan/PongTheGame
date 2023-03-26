import { Module } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [PrismaModule, WebsocketsModule, giveAchievementModule, GameModule],
})
export class GameModule {}
