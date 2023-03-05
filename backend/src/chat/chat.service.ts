import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  // Array containing all chatrooms
  chatRooms: ChatRoomDto[] = [];

  identify(roomName: string, nick: string, modes: string, online: boolean) {
    const room = this.getChatRoomByName(roomName);
    if (!room) throw new WsException('identify: unknown room name!');
    // Do nothing if user is already identified
    for (const nickName in room.users) {
      if (nickName === nick && room.users[nickName].isOnline === online) return;
    }
    room.users[nick] = { isOnline: online, modes: modes, lastPinged: new Date() };
  }

  quitRoom(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[nick].isOnline = false;
    else
      throw new WsException('quitRoom: unknown room name!');
  }

  getChatRoomByName(name: string) {
    for (const room in this.chatRooms)
      if (this.chatRooms[room].name === name) return this.chatRooms[room];
    throw new WsException('getChatRoomByName: unknown room name!');
  }

  // getUserById(roomName: string, clientId: string) {
  //   const room = this.getChatRoomByName(roomName);
  //   if (room) return room.users[clientId];
  //   throw new WsException('getUserById: unknown room name!');
  // }

  // Create a new message object and push it to the messages array
  createMessage(roomName: string, msg: MessageDto) {
    const message = { ...MessageDto };
    const room = this.getChatRoomByName(roomName);
    if (room) {
      room.messages.push(msg);
      return message;
    }
    throw new WsException('createMessage: unknown room name!');
  }

  // Create a new chat room object and push it to the chat rooms array
  // the creator will get admin privileges
  createChatRoom(room: ChatRoomDto, nick: string) {
    const chatRoom = { ...ChatRoomDto };
    if (room) {
      // Add room to room array
      this.chatRooms.push(room);
      // Identify creator as the oper(=admin)
      this.identify(room.name, nick, 'o', false);
      return chatRoom;
    }
    throw new WsException("createChatRoom: 'room' argument is missing!");
  }

  // Return all messages from the chatroom
  findAllMessages(roomName: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) return room.messages;
    throw new WsException('findAllMessages: unknown room name!');
  }

  findAllChatRooms() {
    return this.chatRooms;
  }

  changePassword(roomName: string, newPassword: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      room.password = newPassword;
      // If the room wasn't in 'password protected' mode,
      // it gets it
      if (room.modes.search('p') === -1) room.modes = 'p';
    } else throw new WsException('changePassword: unknown room name!');
  }

  removePassword(roomName: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      room.password = '';
      room.modes = '';
    } else throw new WsException('changePassword: unknown room name!');
  }

  isUserOper(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      // Look for oper mode ('o') in user's modes
      if (room.users[nick].modes.search('o') != -1) return true;
      return false;
    }
    throw new WsException('isUserOper: unknown room name!');
  }

  makeOper(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[nick].modes += 'o';
    else throw new WsException('makeOper: unknown room name!');
  }

  banUser(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      if (nick) room.bannedNicks.push(nick);
    }
    throw new WsException('banUser: unknown room name!');
  }

  // updatePingTime(roomName: string, nick: string) {
  //   const room = this.getChatRoomByName(roomName);
  //   if (room) {
  //     if (nick) {
  //       room.users[nick].lastPinged = new Date();
  //     }
  //   }
  //   throw new WsException('updatePingTime: unknown room name!');
  // }

  getUserLastPingTime(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (!room) throw new WsException('getUserLastPingTime: unknown room name!');
    return room.users[nick].lastPinged;
  }

  getChatRooms() {
    return this.chatRooms;
  }
}
