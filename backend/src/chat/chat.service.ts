import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  // Array containing all chatrooms
  chatRooms: ChatRoomDto[] = [];

  identify(roomName: string, user: User, clientId: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[clientId].profile = user;
  }

  quitRoom(roomName: string, userName: string, clientId: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) delete room.users[clientId];
  }

  getChatRoomByName(name: string) {
    for (let i = 0; i < this.chatRooms.length; ++i)
      if (this.chatRooms[i].name === name) return this.chatRooms[i];
    return null;
  }

  getUserById(roomName: string, clientId: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) return room.users[clientId];
    return null;
  }

  // Create a new message object and push it to the messages array
  createMessage(roomName: string, msg: MessageDto) {
    const message = { ...MessageDto };
    const room = this.getChatRoomByName(roomName);
    if (room) room.messages.push(msg);
    return message;
  }

  // Create a new chat room object and push it to the chat rooms array
  createChatRoom(room: ChatRoomDto) {
    const chatRoom = { ...ChatRoomDto };
    if (room) this.chatRooms.push(room);
    return chatRoom;
  }

  // Return all messages from the chatroom
  findAllMessages(roomName: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) return room.messages;
    return null;
  }

  findAllChatRooms() {
    return this.chatRooms;
  }
}
