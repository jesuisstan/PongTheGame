export type ConfigKey =
  | 'INTRA42_CLIENT_ID'
  | 'INTRA42_CLIENT_SECRET'
  | 'INTRA42_CALLBACK_URL'
  | 'GITHUB_CLIENT_ID'
  | 'GITHUB_CLIENT_SECRET'
  | 'GITHUB_CALLBACK_URL'
  | 'BACKEND_PORT'
  | 'SESSION_SECRET'
  | 'JWT_SECRET';

export type Config = Record<ConfigKey, string>;
