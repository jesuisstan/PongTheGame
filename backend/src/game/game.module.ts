import { Module } from '@nestjs/common';
import { AchivementModule } from 'src/achievement/achievement.module';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  providers: [GameService, GameGateway],
  imports: [PrismaModule, WebsocketsModule, giveAchievementModule],
})
export class GameModule {}