import { Module } from '@nestjs/common';
import { GithubController } from 'src/auth/github/github.controller';
import { GithubStrategy } from 'src/auth/github/github.strategy';
import { AuthProvider } from '../auth.provider';
import { SessionModule } from '../session/session.module';
import { GithubService } from './github.service';

@Module({
  controllers: [GithubController],
  providers: [
    GithubStrategy,
    {
      provide: AuthProvider,
      useClass: GithubService,
    },
  ],
  imports: [SessionModule],
})
export class GithubModule {}
