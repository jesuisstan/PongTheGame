import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  // Array containing all chatrooms
  chatRooms: ChatRoomDto[] = [];
  privRooms: ChatRoomDto[] = [];

  identify(roomName: string, nick: string, modes: string, online: boolean) {
    const room = this.getChatRoomByName(roomName);
    if (!room) throw new WsException({ msg: 'identify: unknown room name!' });
    // Do nothing if user is already identified
    for (const nickName in room.users) {
      if (nickName === nick && room.users[nickName].isOnline === online) return;
    }
    if (room.users[nick])
      room.users[nick] = {
        isOnline: online,
        modes: (room.users[nick].modes += modes),
        lastPinged: new Date(),
      };
    else
      room.users[nick] = {
        isOnline: online,
        modes: modes,
        lastPinged: new Date(),
      };
  }

  quitRoom(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[nick].isOnline = false;
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
  createChatRoom(room: ChatRoomDto, nick: string, user2: string) {
    if (room) {
      // Add room to room array
      this.chatRooms.push(room);

      // If it is a private conversation
      if (user2) {
        this.identify(room.name, nick, '', false);
        this.identify(room.name, user2, '', false);
        return;
      }

      // Identify creator as the oper(=admin)
      this.identify(room.name, nick, 'o', false);
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
        console.log('iiiiii' + room.modes);
      }
    } else throw new WsException({ msg: 'changePassword: unknown room name!' });
  }

  isUserOper(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      // Look for oper mode ('o') in user's modes
      if (room.users[nick].modes.search('o') !== -1) return true;
      return false;
    }
    throw new WsException({ msg: 'isUserOper: unknown room name!' });
  }

  makeOper(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) room.users[nick].modes += 'o';
    else throw new WsException({ msg: 'makeOper: unknown room name!' });
  }

  banUser(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      if (nick) room.bannedNicks.push(nick);
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  unBanUser(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);
    if (room) {
      if (nick)
        for (let i = 0; i < room.bannedNicks.length; ++i)
          if (room.bannedNicks[i] === nick) room.bannedNicks.splice(i, 1);
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  isUserBanned(roomName: string, nick: string) {
    const room = this.getChatRoomByName(roomName);

    if (room) {
      for (let i = 0; i < room.bannedNicks.length; ++i) {
        if (room.bannedNicks[i] === nick) return true;
      }
      return false;
    } else throw new WsException({ msg: 'isUserBanned: unknown room name!' });
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
    if (!room)
      throw new WsException({ msg: 'getUserLastPingTime: unknown room name!' });
    return room.users[nick].lastPinged;
  }

  getChatRooms() {
    return this.chatRooms;
  }
}
