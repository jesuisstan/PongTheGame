import { User } from '@prisma/client';

export class Message {
  author: User;
  data: string;
  timestamp: Date;
}

export type Member = {
	memberId: number;
	isOnline: boolean;
	modes: string;
}

export class ChatRoom {
  name: string;
  owner: number;
  modes: string;
  password: string;
  userLimit: number;
	members: Member[];
  messages: Message[];
  bannedUsers: User[];
}