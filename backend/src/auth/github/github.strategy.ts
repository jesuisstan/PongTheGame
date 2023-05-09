import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import { SessionService } from 'src/auth/session/session.service';
import { Config } from 'src/config.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    config: ConfigService<Config>,
    private readonly auth: SessionService,
  ) {
    const clientId = config.getOrThrow<string>('GITHUB_CLIENT_ID');
    const secret = config.getOrThrow<string>('GITHUB_CLIENT_SECRET');
    const backendUrl = config.getOrThrow<string>('BACKEND_URL');
    const callbackUrl = `${backendUrl}/auth/github/callback`;

    super({
      clientID: clientId,
      clientSecret: secret,
      callbackURL: callbackUrl,
    } as StrategyOptions);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.auth.validateUser(profile);
  }
}
