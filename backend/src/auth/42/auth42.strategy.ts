import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-42';
import { SessionService } from 'src/auth/session/session.service';
import { Config } from 'src/config.interface';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(
    readonly config: ConfigService<Config>,
    private readonly auth: SessionService,
  ) {
    super({
      clientID: config.getOrThrow('INTRA42_CLIENT_ID'),
      clientSecret: config.getOrThrow('INTRA42_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('INTRA42_CALLBACK_URL'),
      state: true,
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        username: 'login',
        displayName: 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        profileUrl: 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image.link',
      },
    } as StrategyOptions);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.auth.validateUser(profile);
  }
}
