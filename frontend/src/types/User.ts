import { ChatRoomType } from './chat';

export type User = {
  avatar: string | undefined;
  id: number;
  nickname: string;
  profileId: string;
  provider: string;
  role: string;
  blockedUsers: User[];
  blockedBy: User[];
  joinedChatRoom: ChatRoomType | undefined;
  status: string;
  totpSecret: null | {
    verified: boolean;
  };
  username: string;
};
