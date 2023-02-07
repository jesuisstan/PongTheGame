import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubStrategy } from './github.strategy';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../../user/user.module';

@Module({
  controllers: [GithubController],
  providers: [GithubStrategy],
  imports: [SessionModule, UserModule, SessionModule],
})
export class GithubModule {}
