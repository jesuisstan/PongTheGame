import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-42';
import { Config } from 'src/config.interface';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(readonly config: ConfigService<Config>) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: config.getOrThrow('42_CLIENT_ID'),
      clientSecret: config.getOrThrow('42_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('42_CALLBACK_URL'),
      state: true,
      profileFields: {
        'id': function (obj) { return String(obj.id); },
        'displayName': 'displayname',
        'username': 'login',
        'avatar': 'image.link',
        'provider': 'provider'
      }
    } as StrategyOptions);
  }

  // TODO
  async validate(accessToken: string, refreshToken: string, profile: any) {
    delete profile._raw;
    delete profile._json;
    return profile;
  }
}
