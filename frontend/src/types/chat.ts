import { User } from './User';

export type Message = {
  author: User;
  data: string;
  timestamp: Date;
};

export type MemberType = {
  memberId: number;
  nickName: string;
  avatar: string;
  isOnline: boolean;
  modes: string;
};

export type ChatRoomType = {
  name: string;
  owner: number;
  modes: string;
  password: string;
  userLimit: number;
  members: MemberType[];
  messages: Message[];
  bannedUsers: User[];
};
