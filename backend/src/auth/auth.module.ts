import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from './42/auth42.module';
import { AuthController } from './auth.controller';
import { GithubModule } from './github/github.module';
import { SessionModule } from './session/session.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    SessionModule,
    Auth42Module,
    GithubModule,
    UserModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
