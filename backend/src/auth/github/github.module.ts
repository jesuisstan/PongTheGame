import { Module } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { GithubController } from 'src/auth/github/github.controller';
import { GithubStrategy } from 'src/auth/github/github.strategy';
import { SessionModule } from 'src/auth/session/session.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [GithubController],
  providers: [GithubStrategy],
  imports: [SessionModule, UserModule, SessionModule, giveAchievementModule],
})
export class GithubModule {}
