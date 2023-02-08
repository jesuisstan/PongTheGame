import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from 'src/auth/42/auth42.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { GithubModule } from 'src/auth/github/github.module';
import { SessionModule } from 'src/auth/session/session.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    SessionModule,
    Auth42Module,
    GithubModule,
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
