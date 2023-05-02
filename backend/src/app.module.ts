import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AchivementModule } from 'src/achievement/achievement.module';
import { AuthModule } from 'src/auth/auth.module';
import { AvatarModule } from 'src/avatar/avatar.module';
import { LoggerMiddleware } from 'src/logger.middleware';
import { MatchModule } from 'src/match/match.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatusController } from 'src/status/status.controller';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './game/game.module';
import { StatsModule } from './stats/stats.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AchivementModule,
    AuthModule,
    UserModule,
    MatchModule,
    PrismaModule,
    FriendsModule,
    ChatModule,
    AvatarModule,
    GameModule,
    WebsocketsModule,
    StatsModule,
  ],
  providers: [LoggerMiddleware],
  controllers: [StatusController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAA');

    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
