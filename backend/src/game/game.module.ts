import { forwardRef, Module } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  exports: [GameService],
  providers: [GameService, GameGateway],
  imports: [
    PrismaModule,
    giveAchievementModule,
    forwardRef(() => WebsocketsModule),
  ],
})
export class GameModule {}
