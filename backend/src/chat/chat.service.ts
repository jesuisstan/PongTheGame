import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/chat.entity';

@Injectable()
export class ChatService {
  // All messages from the chatroom
  messages: Message[] = [];
  // All users that have joined the chatroom
  users: { [key: string]: string } = {};

  identify(userName: string, clientId: string) {
    this.users[clientId] = userName;

    return Object.values(this.users);
  }

  getClientNameById(clientId: string) {
    return this.users[clientId];
  }

  // Create a new message object and push it to the messages array
  create(createMessageDto: CreateMessageDto) {
    const message = { ...CreateMessageDto };
    this.messages.push(createMessageDto);
    return message;
  }

  // Return all messages from the chatroom
  findAll() {
    return this.messages;
  }
}
