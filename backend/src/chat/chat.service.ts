import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  // Array containing all chatrooms
  chatRooms: ChatRoomDto[] = [];
  privRooms: ChatRoomDto[] = [];

  identify(roomName: string, userId: number, modes: string, online: boolean) {
    const room = this.getChatRoomByName(roomName);
    if (!room) throw new WsException({ msg: 'identify: unknown room name!' });
    // Do nothing if user is already identified
    for (const id in room.users) {
      if (String(userId) === id && room.users[id].isOnline === online) return;
    }
    if (room.users[userId])
      room.users[userId] = {
        isOnline: online,
        modes: (room.users[userId].modes += modes),
      };
    else
      room.users[userId] = {
        isOnline: online,
        modes: modes,
      };
  }

  quitRoom(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[userId].isOnline = false;
    else throw new WsException({ msg: 'quitRoom: unknown room name!' });
  }

  getChatRoomByName(name: string) {
    for (const room in this.chatRooms)
      if (this.chatRooms[room].name === name) return this.chatRooms[room];
    return null;
  }

  // Create a new message object and push it to the messages array
  createMessage(roomName: string, msg: MessageDto) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.messages.push(msg);
    else throw new WsException({ msg: 'createMessage: unknown room name!' });
  }

  // Create a new chat room object and push it to the chat rooms array
  // the creator will get admin privileges
  createChatRoom(room: ChatRoomDto, userId: number, user2Id: number) {
    if (room) {
      // Add room to room array
      this.chatRooms.push(room);

      // If it is a private conversation
      if (user2Id) {
        this.identify(room.name, userId, '', false);
        this.identify(room.name, user2Id, '', false);
        return;
      }

      // Identify creator as the oper(=admin)
      this.identify(room.name, userId, 'o', false);
    } else
      throw new WsException({
        msg: "createChatRoom: 'room' argument is missing!",
      });
  }

  // Return all messages from the chatroom
  findAllMessages(roomName: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) return room.messages;
    throw new WsException({ msg: 'findAllMessages: unknown room name!' });
  }

  findAllChatRooms() {
    return this.chatRooms;
  }

  // Return all members from the chatroom
  findAllMembers(roomName: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) return room.users;
    throw new WsException({ msg: 'findAllMembers: unknown room name!' });
  }

  changePassword(roomName: string, newPassword: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      // If a new password was given
      if (newPassword) {
        room.password = newPassword;
        // If the room wasn't in 'password protected' mode,
        // it gets it
        if (room.modes.search('p') === -1) room.modes += 'p';
      } // No given password means we remove the password
      else {
        room.password = '';
        if (room.modes.search('p') !== -1)
          room.modes = room.modes.replace(/p/g, '');
      }
    } else throw new WsException({ msg: 'changePassword: unknown room name!' });
  }

  isUserOper(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      // Look for oper mode ('o') in user's modes
      if (room.users[userId].modes.search('o') !== -1) return true;
      return false;
    }
    throw new WsException({ msg: 'isUserOper: unknown room name!' });
  }

  makeOper(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[userId].modes += 'o';
    else throw new WsException({ msg: 'makeOper: unknown room name!' });
  }

  banUser(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      if (userId) room.bannedUsers.push(userId);
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  unBanUser(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      if (userId)
        for (let i = 0; i < room.bannedUsers.length; ++i)
          if (room.bannedUsers[i] === userId) room.bannedUsers.splice(i, 1);
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  isUserBanned(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);

    if (room) {
      for (let i = 0; i < room.bannedUsers.length; ++i) {
        if (room.bannedUsers[i] === userId) return true;
      }
      return false;
    } else throw new WsException({ msg: 'isUserBanned: unknown room name!' });
  }

  getChatRooms() {
    return this.chatRooms;
  }

  muteUser(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[userId].modes += 'm';
    else throw new WsException({ msg: 'muteUser: unknown room name!' });
  }

  unMuteUser(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room)
      if (room.users[userId].modes.search('m') !== -1)
        room.users[userId].modes.replace(/m/g, '');
      else throw new WsException({ msg: 'unMuteUser: unknown room name!' });
  }

  isUserMuted(roomName: string, userId: number) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      // Look for mute mode ('m') in user's modes
      if (room.users[userId].modes.search('m') !== -1) return true;
      return false;
    }
    throw new WsException({ msg: 'isUserMuted: unknown room name!' });
  }
}
