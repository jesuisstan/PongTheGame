import { Module } from '@nestjs/common';
import { GithubController } from 'src/auth/github/github.controller';
import { GithubStrategy } from 'src/auth/github/github.strategy';
import { UserModule } from 'src/user/user.module';
import { SessionModule } from '../session/session.module';

@Module({
  controllers: [GithubController],
  providers: [GithubStrategy],
  imports: [SessionModule, UserModule, SessionModule],
})
export class GithubModule {}
