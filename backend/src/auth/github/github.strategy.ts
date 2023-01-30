import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { parse as parseProfile } from 'passport-42/lib/profile';
import { Strategy, StrategyOptions } from 'passport-github2';
import { Config } from 'src/config.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(readonly config: ConfigService<Config>) {
    super({
      clientID: config.getOrThrow('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow('GITHUB_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('GITHUB_CALLBACK_URL'),
    } as StrategyOptions);
  }

  // TODO sync with database
  async validate(accessToken: string, refreshToken: string, profile: any) {
    delete profile._raw;
    delete profile._json;
    return parseProfile(profile, {
      id: function (obj: any) {
        return String(obj.id);
      },
      displayName: 'displayname',
      username: 'login',
      avatar: 'photos.0.value',
      provider: 'provider',
    });
  }
}
