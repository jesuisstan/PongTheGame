export type User = {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
  profileId: String;
  provider: string;
  blockedUsers: string[];
  joinedChatRoom: string;
  totpSecret: null | {
    verified: boolean;
  };
};
