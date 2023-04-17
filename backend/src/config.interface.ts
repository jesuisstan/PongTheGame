export type NodeEnv = 'production' | 'development';

export interface Config {
  INTRA42_CLIENT_ID: string;
  INTRA42_CLIENT_SECRET: string;
  INTRA42_CALLBACK_URL: string;

  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GITHUB_CALLBACK_URL: string;

  BACKEND_URL: string;
  FRONTEND_URL: string;

  DATABASE_URL: string;
  SESSION_SECRET: string;
  TOTP_SECRET: string;
  JWT_SECRET: string;

  NODE_ENV: NodeEnv;
}
