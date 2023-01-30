import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth42Module } from 'src/auth/42/auth42.module';
import { AuthController } from 'src/auth/auth.controller';
import { GithubModule } from 'src/auth/github/github.module';
import { SessionSerializer } from './session-serializer';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    Auth42Module,
    GithubModule,
  ],
  providers: [SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
