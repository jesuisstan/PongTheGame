import { Profile } from 'passport';
import {
  Strategy as OAuth2Strategy,
  StrategyOptions as OAuth2StrategyOptions,
  VerifyFunction,
} from 'passport-oauth2';

declare module 'passport-42' {
  type StrategyOptions = PartialOmit<
    OAuth2StrategyOptions,
    'authorizationURL' | 'tokenURL'
  > & {
    profileFields?: {
      [K: string]: boolean | string | (<T = any>(obj: Profile) => T);
    };
  };

  class Strategy extends OAuth2Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
}
