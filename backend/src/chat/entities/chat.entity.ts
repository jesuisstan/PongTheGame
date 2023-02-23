import { User } from '@prisma/client';

export class Message {
  author: User;
  data: string;
}

export class ChatRoom {
  name: string;
  modes: string;
  password: string;
  userLimit: number;
  users: { [nick: string]: { modes: string } };
  messages: Message[];
  bannedNicks: string[];
}
