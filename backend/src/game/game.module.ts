import { Module } from '@nestjs/common';
import { GameGateway } from 'src/game/game.gateway';
import { GameService } from 'src/game/game.service';

@Module({
  providers: [GameService, GameGateway]
})
export class GameModule {}
