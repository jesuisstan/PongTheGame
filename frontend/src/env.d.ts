declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development';
      REACT_APP_URL_BACKEND: string;
    }
  }
}
export {};
