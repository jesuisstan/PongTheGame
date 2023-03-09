import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpModule } from 'src/auth/totp/totp.module';
import { MatchController } from 'src/match/match.controller';
import { MatchService } from 'src/match/match.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [PrismaModule, UserModule, TotpModule],
})
export class MatchModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TotpMiddleware).forRoutes(MatchController);
  }
}
