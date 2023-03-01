import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TotpController } from 'src/auth/totp/totp.controller';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpService } from 'src/auth/totp/totp.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TotpController],
  providers: [TotpService, TotpMiddleware],
  imports: [UserModule, PrismaModule],
  exports: [TotpService, TotpMiddleware],
})
export class TotpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes(TotpController);
  }
}
