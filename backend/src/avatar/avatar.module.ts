import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpModule } from 'src/auth/totp/totp.module';
import { AvatarController } from 'src/avatar/avatar.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [UserModule, TotpModule],
})
export class AvatarModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TotpMiddleware).forRoutes(AvatarController);
  }
}
