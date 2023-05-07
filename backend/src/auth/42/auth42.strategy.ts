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
    config: ConfigService<Config>,
    private readonly auth: SessionService,
  ) {
    const clientId = config.getOrThrow<string>('INTRA42_CLIENT_ID');
    const secret = config.getOrThrow<string>('INTRA42_CLIENT_SECRET');
    const backendUrl = config.getOrThrow<string>('BACKEND_URL');
    const callbackUrl = `${backendUrl}/auth/42/callback`;

    super({
      clientID: clientId,
      clientSecret: secret,
      callbackURL: callbackUrl,
      state: true,
      profileFields: {
        id: (obj: any) => obj.id.toString(),
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
