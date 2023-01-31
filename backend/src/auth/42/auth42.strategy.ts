import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, StrategyOptions } from 'passport-42';
import { Config } from 'src/config.interface';
import { AuthProvider } from '../auth.provider';

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(
    readonly config: ConfigService<Config>,
    @Inject(AuthProvider) private readonly auth: AuthProvider,
  ) {
    super({
      clientID: config.getOrThrow('INTRA42_CLIENT_ID'),
      clientSecret: config.getOrThrow('INTRA42_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('INTRA42_CALLBACK_URL'),
      state: true,
    } as StrategyOptions);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.auth.validateUser(profile);
  }
}
