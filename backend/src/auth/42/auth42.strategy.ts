import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-42';
import { Config } from 'src/config.interface';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly config: ConfigService<Config>) {
    super({
      clientID: config.getOrThrow('INTRA42_CLIENT_ID'),
      clientSecret: config.getOrThrow('INTRA42_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('INTRA42_CALLBACK_URL'),
      state: true,
      profileFields: {
        id: function (obj: any) {
          return String(obj.id);
        },
        displayName: 'displayname',
        username: 'login',
        avatar: 'image.link',
        provider: 'provider',
      },
    } as StrategyOptions);
  }

  // TODO sync with database
  async validate(accessToken: string, refreshToken: string, profile: any) {
    delete profile._raw;
    delete profile._json;
    return profile;
  }
}
