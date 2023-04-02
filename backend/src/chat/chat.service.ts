import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}

  async identify(roomName: string, userId: number, modes: string, online: boolean) {
    const room = await this.getChatRoomByName(roomName);
    if (!room) throw new WsException({ msg: 'identify: unknown room name!' });
    // Do nothing if user is already identified
    var found = false;
    var foundModes = "";
    for (const id in room.users) {
      if (String(userId) === id) {
        found = true;
        foundModes = room.users[id].modes;
        if (room.users[id].isOnline === online) {
          return;
        }
      }
    }
    if (found) {
      await this.prisma.member.update({
        where: { id: userId },
        data: { modes: foundModes += modes}
      })
    }
    else
      await this.prisma.member.create({
        data: {
          id: userId,
          isOnline: online,
          modes: modes
        }
      })
  }

  async quitRoom(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      await this.prisma.member.update({
        where: { chatRoomName: roomName },
        data : { isOnline: false }
      })
    }
    else throw new WsException({ msg: 'quitRoom: unknown room name!' });
  }

  async getChatRoomByName(name: string) {
    return await this.prisma.chatroom.findUnique({
      where: { name: name }
    })
  }

  // Create a new message object and push it to the messages array
  async createMessage(roomName: string, msg: MessageDto) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      await this.prisma.message.create({
        data: {
          authorId: msg.author.id,
          data: msg.data,
          chatRoomName: roomName
        }
      })
    }
    else throw new WsException({ msg: 'createMessage: unknown room name!' });
  }

  // Create a new chat room object and push it to the chat rooms array
  // the creator will get admin privileges
  async createChatRoom(room: ChatRoomDto, userId: number, user2Id: number) {
    if (room) {
      // Add room to room array
      const r = await this.prisma.chatroom.create({
        data: {
          name: room.name,
          modes: room.modes,
          password: room.password,
          userLimit: room.userLimit,
          users: room.users,
          messages: {},
          bannedUsers: []
        }
      })
      console.log('created room: '+ r);
      // this.chatRooms.push(room);

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
  async findAllMessages(roomName: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) return room.messages;
    throw new WsException({ msg: 'findAllMessages: unknown room name!' });
  }

  findAllChatRooms() {
    return this.chatRooms;
  }

  // Return all members from the chatroom
  async findAllMembers(roomName: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) room.users;
    throw new WsException({ msg: 'findAllMembers: unknown room name!' });
  }

  async changePassword(roomName: string, newPassword: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // If a new password was given
      if (newPassword) {
        // If the room wasn't in 'password protected' mode,
        // it gets it
        if (room.modes.search('p') === -1)  {
          await this.prisma.chatroom.update({
            where: { name: roomName },
            data: {
              modes: room.modes + 'p',
              password: newPassword
            }
          })
        }        
      } // No given password means we remove the password
      else {
        await this.prisma.chatroom.update({
          where: { name: roomName },
          data: { password: '' }
        }) // and we remove the 'password protected' mode
        if (room.modes.search('p') !== -1)
          var modes = room.modes.replace(/p/g, '');
          await this.prisma.chatroom.update({
            where: { name: roomName },
            data: { modes: modes }
          })         
      }
    } else throw new WsException({ msg: 'changePassword: unknown room name!' });
  }

  async isUserOper(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // Look for oper mode ('o') in user's mode
      for (var i=0; i < room.users.length; ++i)
        if (room.users[i].id === userId && room.users[i].modes.search('o') !== -1)
          return true;
      return false;
    }
    throw new WsException({ msg: 'isUserOper: unknown room name!' });
  }

  async makeOper(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // Look for oper mode ('o') in user's mode
      // Add 'o' mode if not already there
      var modes = "";
      for (var i=0; i < room.users.length; ++i)
        if (room.users[i].id === userId) {
          modes = room.users[i].modes;
          if (room.users[i].modes.search('o') === -1)
            modes += 'o';
        }
      // Save the new modes
      await this.prisma.member.update({
        where: { chatRoomName: roomName },
        data : { modes: modes }
      })
    }
    else throw new WsException({ msg: 'makeOper: unknown room name!' });
  }

  async banUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        // Get the current banned users' list
        var bannedUsers = this.prisma.chatroom.findUnique({
          where: { name: roomName },
          select: { bannedUsers: true }
        })
        // If that list isn't empty, push the new user into it
        if (bannedUsers) bannedUsers.push(userId);
        else bannedUsers = [userId] };
        // Save the new list to the database
        this.prisma.chatroom.update({
          where: { name: roomName },
          data: { bannedUsers: bannedUsers }
        })
    }
    else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  async unBanUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        // Get the current banned users' list
        var bannedUsers = this.prisma.chatroom.findUnique({
          where: { name: roomName },
          select: { bannedUsers: true }
        })
        // If that list isn't empty, erase the user from it
        if (bannedUsers) {
          for (let i = 0; i < bannedUsers.length; ++i)
          if (bannedUsers[i] === userId) bannedUsers.splice(i, 1);
        }
        // Save the new list to the database
        this.prisma.chatroom.update({
          where: { name: roomName },
          data: { bannedUsers: bannedUsers }
        })
      }
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  async isUserBanned(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      for (let i = 0; i < room.bannedUsers.length; ++i) {
        if (room.bannedUsers[i] === userId) return true;
      }
      return false;
    } else throw new WsException({ msg: 'isUserBanned: unknown room name!' });
  }

  async getChatRooms() {
    return await this.prisma.chatroom.findMany();
  }

  async muteUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // Get user's modes and remove 'm' mode if found
      var modes = "";
      for (var i=0; i < room.users.length; ++i)
        if (room.users[i].id === userId) {
          modes = room.users[i].modes;
          if (room.users[i].modes.search('m') === -1)
            modes += 'm';
        }
      // Save the new modes
      await this.prisma.member.update({
        where: { chatRoomName: roomName },
        data : { modes: modes }
      })
    }
    else throw new WsException({ msg: 'muteUser: unknown room name!' });
  }

  async unMuteUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // Get user's modes and remove 'm' mode if found
      var modes = "";
      for (var i=0; i < room.users.length; ++i)
        if (room.users[i].id === userId) {
          modes = room.users[i].modes;
          if (room.users[i].modes.search('m') !== -1)
            modes.replace(/m/g, '');
        }
      // Save the new modes
      await this.prisma.member.update({
        where: { chatRoomName: roomName },
        data : { modes: modes }
      })
    } else throw new WsException({ msg: 'unMuteUser: unknown room name!' });
  }

  async isUserMuted(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // Look for mute mode ('m') in user's modes
      for (var i=0; i < room.users.length; ++i)
        if (room.users[i].id === userId && room.users[i].modes.search('m') !== -1)
          return true;
      return false;
    }
    throw new WsException({ msg: 'isUserMuted: unknown room name!' });
  }
}
