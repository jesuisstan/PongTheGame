import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpModule } from 'src/auth/totp/totp.module';
import { AvatarController } from 'src/avatar/avatar.controller';
import { UserModule } from 'src/user/user.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  controllers: [AvatarController],
  providers: [],
  imports: [UserModule, TotpModule, giveAchievementModule, WebsocketsModule],
})
export class AvatarModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TotpMiddleware).forRoutes(AvatarController);
  }
}
