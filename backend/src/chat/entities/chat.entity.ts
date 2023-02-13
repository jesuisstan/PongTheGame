import { User } from '@prisma/client';

export class Message {
  author: string;
  data: string;
}

export class ChatRoom {
  name: string;
  modes: string;
  password: string;
  userLimit: number;
  users: { [key: string]: User };
  banList: string[];
  messages: Message[];
}
