import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from 'src/auth/42/auth42.module';
import { AuthController } from 'src/auth/auth.controller';
import { GithubModule } from 'src/auth/github/github.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    SessionModule,
    Auth42Module,
    GithubModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
