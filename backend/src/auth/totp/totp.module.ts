import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TotpController } from 'src/auth/totp/totp.controller';
import { TotpService } from 'src/auth/totp/totp.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TotpController],
  providers: [TotpService],
  imports: [UserModule, PrismaModule],
})
export class TotpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes(TotpController);
  }
}
