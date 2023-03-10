export type User = {
  avatar: string | undefined;
  id: number;
  nickname: string;
  profileId: string;
  provider: string;
  role: string;
  totpSecret: null | {
    verified: boolean;
  };
  username: string;
};
