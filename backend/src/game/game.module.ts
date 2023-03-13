import { Module } from '@nestjs/common';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [GameService, GameGateway],
  imports: [PrismaModule],
})
export class GameModule {}
