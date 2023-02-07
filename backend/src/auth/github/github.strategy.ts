import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import { SessionService } from '../session/session.service';
import { Config } from '../../config.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    readonly config: ConfigService<Config>,
    private readonly auth: SessionService,
  ) {
    super({
      clientID: config.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('GITHUB_CALLBACK_URL'),
    } as StrategyOptions);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.auth.validateUser(profile);
  }
}
