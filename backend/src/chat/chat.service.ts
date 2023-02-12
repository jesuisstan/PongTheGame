import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { messageDto, chatRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  // All chatrooms
  chatRooms: chatRoomDto[] = [];
  // All messages from the chatroom
  messages: messageDto[] = [];
  // // All users that have joined the chatroom
  // users: { [key: string]: string } = {};

  identify(room: chatRoomDto, user: User, clientId: string) {
    room.users[clientId] = user;
    // return Object.values(room.users);
  }

  // getChatRoomByName(name: string) {
  //   for (let i = 0; i < this.chatRooms.length; ++i)
  //     if (this.chatRooms[i].name === name) return this.chatRooms[i];
  // }

  getUserById(room: chatRoomDto, clientId: string) {
    return room.users[clientId];
  }

  // Create a new message object and push it to the messages array
  createMessage(messageDto: messageDto) {
    const message = { ...messageDto };
    this.messages.push(messageDto);
    return message;
  }
  // Create a new chat room object and push it to the chat rooms array
  createChatRoom(chatRoomDto: chatRoomDto) {
    const chatRoom = { ...chatRoomDto };
    this.chatRooms.push(chatRoomDto);
    return chatRoom;
  }

  // Return all messages from the chatroom
  findAllMessages() {
    return this.messages;
  }

  findAllChatRooms() {
    return this.chatRooms;
  }
}
