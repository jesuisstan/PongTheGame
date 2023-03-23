import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from 'src/auth/42/auth42.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { GithubModule } from 'src/auth/github/github.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TotpMiddleware } from 'src/auth/totp/totp.middleware';
import { TotpModule } from 'src/auth/totp/totp.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    Auth42Module,
    GithubModule,
    UserModule,
    TotpModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TotpMiddleware).forRoutes('/auth/getuser');
  }
}
