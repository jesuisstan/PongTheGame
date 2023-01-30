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

  type Profile = {
    id: number;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    usual_full_name: string;
    usual_first_name: string;
    url: string;
    displayname: string;
    image: {
      link: string;
      versions: {
        large: string;
        medium: string;
        small: string;
        micro: string;
      };
    };
  };
}
