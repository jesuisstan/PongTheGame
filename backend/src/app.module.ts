import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Config, NodeEnv } from 'src/config.interface';

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
  constructor(private readonly config: ConfigService<Config>) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.config.getOrThrow<NodeEnv>('NODE_ENV') === 'development') {
      consumer
        .apply(LoggerMiddleware)
        .exclude({
          path: '/healthcheck',
          method: RequestMethod.GET,
        })
        .forRoutes({
          path: '*',
          method: RequestMethod.ALL,
        });
    }
  }
}
