declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_URL_BACKEND: string;
      REACT_APP_MAX_CHATROOM_NBR: string;
    }
  }
}
export {};
