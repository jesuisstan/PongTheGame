import { User } from '@prisma/client';

export class Message {
  author: User;
  data: string;
}

export class ChatRoom {
  name: string;
  owner: number;
  modes: string;
  password: string;
  userLimit: number;
	members: {
		id: number;
		isOnline: boolean;
		modes: string;
	}
  messages: Message[];
  bannedUsers: number[];
}