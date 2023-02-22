export type User = {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
  profileId: String;
  provider: string;
  totpEnabled: boolean;
  blockedUsers: User[];
};
