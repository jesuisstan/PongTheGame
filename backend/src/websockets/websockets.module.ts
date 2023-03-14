import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [WebsocketGateway, WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
