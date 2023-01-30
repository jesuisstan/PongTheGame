import { Module } from '@nestjs/common';
import { GithubController } from 'src/auth/github/github.controller';
import { GithubStrategy } from 'src/auth/github/github.strategy';

@Module({
  controllers: [GithubController],
  providers: [GithubStrategy],
})
export class GithubModule {}
