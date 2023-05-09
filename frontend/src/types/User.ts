export type User = {
  avatar: string | undefined;
  id: number;
  nickname: string;
  profileId: string;
  provider: string;
  blockedUsers: User[];
  blockedBy: User[];
  status: string;
  totpSecret: null | {
    verified: boolean;
  };
  username: string;
};
