import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/chat.entity';

@Injectable()
export class ChatService {
  messages: Message[] = [{ author: 'daisuke', data: 'hey!!' }];
  users: { [key: string]: string } = {};

  identify(userName: string, clientId: string) {
    this.users[clientId] = userName;

    return Object.values(this.users);
  }

  getClientNameById(clientId: string) {
    return this.users[clientId];
  }

  create(createMessageDto: CreateMessageDto) {
    const message = { ...CreateMessageDto };
    this.messages.push(createMessageDto);
    return message;
  }

  findAll() {
    return this.messages;
  }
}
