import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [PrismaModule, forwardRef(() => GameModule), JwtModule.register({})],
  providers: [WebsocketGateway, WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
