import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpModule } from 'src/auth/totp/totp.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, forwardRef(() => TotpModule)],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TotpMiddleware).forRoutes('/user/setnickname');
  }
}
