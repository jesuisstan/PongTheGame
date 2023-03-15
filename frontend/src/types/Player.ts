export type Player = {
  achievements: Array<string> | null;
  avatar: string | undefined;
  id: number;
  matchHistory: Array<string> | null;
  nickname: string;
  profileId: string;
  provider: string;
  role: string;
  username: string;
};
