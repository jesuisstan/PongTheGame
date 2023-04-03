import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ChatService {

  constructor(private readonly prisma: PrismaService) {}

  async identify(roomName: string, userId: number, modes: string, online: boolean) {
    // Check if room exists
    const room = await this.getChatRoomByName(roomName);
    if (!room) throw new WsException({ msg: 'identify: unknown room name!' });
    // Do nothing if user is already identified
    const members = await this.findAllMembers(roomName);
    var found = false;
    var foundModes = "";
    for (let i=0; i < members.length; ++i) {
      if (userId === members[i].memberId) {
        found = true;
        foundModes = members[i].modes;
        if (members[i].isOnline === online) return;
      }
    }
    if (found)
      this.updateUserModes(roomName, userId, foundModes + modes);
    else {
      await this.prisma.member.create({
        data: {
              memberId: userId,
              isOnline: online,
              modes: modes,
              chatRoomName: roomName
        }
      })
    }
  }

  async quitRoom(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      await this.prisma.member.update({
            where: { memberId_chatRoomName: {
              memberId: userId, chatRoomName: roomName }
            },
            data: { isOnline: false }
      })
    }
    else throw new WsException({ msg: 'quitRoom: unknown room name!' });
  }

  async getChatRoomByName(name: string) {
    return await this.prisma.chatRoom.findUnique({
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
      const r = await this.prisma.chatRoom.create({
        data: {
          name: room.name,
          modes: room.modes,
          password: room.password,
          userLimit: room.userLimit,
          members: {},
          messages: {},
          bannedUsers: {}
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
    if (room) return await this.prisma.message.findMany({
      where: { chatRoomName: roomName },
      select: { author: true, data: true }
    });
    throw new WsException({ msg: 'findAllMessages: unknown room name!' });
  }

  findAllChatRooms() { return this.prisma.chatRoom.findMany(); }

  // Return all members from the chatroom
  async findAllMembers(roomName: string) {
    return this.prisma.member.findMany({
      where: { chatRoomName: roomName }
    });
  }

  async changePassword(roomName: string, newPassword: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      // If a new password was given
      const oldModes = String(await this.prisma.chatRoom.findUnique({
        where: { name: roomName },
        select: { password: true }
      }));

      if (newPassword) {
        // If the room wasn't in 'password protected' mode,
        // it gets it
        if (oldModes.search('p') === -1)  {
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: {
              modes: oldModes + 'p',
              password: newPassword
            }
          })
        }        
      } // No given password means we remove the password
      else {
        await this.prisma.chatRoom.update({
          where: { name: roomName },
          data: { password: '' }
        }) // and we remove the 'password protected' mode
        if (oldModes.search('p') !== -1) {
          var modes = oldModes.replace(/p/g, '');
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: { modes: modes }
          })
        }
      }
    } else throw new WsException({ msg: 'changePassword: unknown room name!' });
  }

  async isUserOper(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const members = await this.findAllMembers(roomName);
      // Look for oper mode ('o') in user's mode
      for (let i=0; i < members.length; ++i)
        if (members[i].memberId === userId && members[i].modes.search('o') !== -1)
          return true;
      return false;
    }
    throw new WsException({ msg: 'isUserOper: unknown room name!' });
  }

  async makeOper(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const members = await this.findAllMembers(roomName);
      // Look for oper mode ('o') in user's mode
      // Add 'o' mode if not already there
      var modes = "";
      for (var i=0; i < members.length; ++i)
        if (members[i].memberId === userId) {
          modes = members[i].modes;
          if (members[i].modes.search('o') === -1)
            modes += 'o';
        }
      // Save the new modes
      this.updateUserModes(roomName, userId, modes);
    }
    else throw new WsException({ msg: 'makeOper: unknown room name!' });
  }

  async banUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        // Check if user isn't already banned
        var bannedUser = await this.prisma.chatRoom.findUnique({
          where: { name: roomName },
          select: {
            bannedUsers: { where: { id: userId } }
          }
        });
        // If not already banned, push the new user into it
        this.prisma.chatRoom.update({
          where: { name: roomName },
          data: { bannedUsers: { connect: { id: userId } }}
        })
      }
    }
    else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  async unBanUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        // Check if user is banned
        const bannedUser = await this.prisma.chatRoom.findUnique({
          where: { name: roomName },
          select: {
            bannedUsers: { where: { id: userId } }
          }
        });
        // If banned, delete the user from the list
        this.prisma.chatRoom.update({
          where: { name: roomName },
          data: { bannedUsers: { disconnect: { id: userId } }}
        })
      }
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  async isUserBanned(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const res = await this.prisma.chatRoom.findUnique({
        where: { name: roomName },
        select: {
          bannedUsers: { where: { id: userId } },
        }
      });
      if (res?.bannedUsers[0]) return true;
      return false;
    }
    else throw new WsException({ msg: 'isUserBanned: unknown room name!' });
  }

  async getChatRooms() {
    return await this.prisma.chatRoom.findMany();
  }

  async updateUserModes(roomName: string, userId: number, modes: string) {
    await this.prisma.member.update({
      where: { memberId_chatRoomName: {
        memberId: userId, chatRoomName: roomName }
      },
      data: { modes: modes }
    })
  }

  async muteUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const members = await this.findAllMembers(roomName);
      // Get user's modes and remove 'm' mode if found
      var modes = "";
      for (var i=0; i < members.length; ++i)
        if (members[i].memberId === userId) {
          modes = members[i].modes;
          if (members[i].modes.search('m') === -1)
            modes += 'm';
        }
      // Save the new modes
      this.updateUserModes(roomName, userId, modes);
    }
    else throw new WsException({ msg: 'muteUser: unknown room name!' });
  }

  async unMuteUser(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const members = await this.findAllMembers(roomName);
      // Get user's modes and remove 'm' mode if found
      var modes = "";
      for (var i=0; i < members.length; ++i)
        if (members[i].memberId === userId) {
          modes = members[i].modes;
          if (members[i].modes.search('m') !== -1)
            modes.replace(/m/g, '');
        }
      // Save the new modes
      this.updateUserModes(roomName, userId, modes);
    } else throw new WsException({ msg: 'unMuteUser: unknown room name!' });
  }

  async isUserMuted(roomName: string, userId: number) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const members = await this.findAllMembers(roomName);
      // Look for mute mode ('m') in user's modes
      for (var i=0; i < members.length; ++i)
        if (members[i].memberId === userId && members[i].modes.search('m') !== -1)
          return true;
      return false;
    }
    throw new WsException({ msg: 'isUserMuted: unknown room name!' });
  }

  async isPasswordProtected(roomName: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      return room.password !== '' ? true : false;
    } else
      throw new WsException({ msg: 'isPasswordProtected: unknown room name!' });
  }

  async checkPassword(roomName: string, password: string) {
    const room = await this.getChatRoomByName(roomName);
    if (room) {
      const res = await this.prisma.chatRoom.findUnique({
        where: { name: roomName },
        select: { password: true }
      });
      return res?.password === password;
    } else
      throw new WsException({ msg: 'isPasswordProtected: unknown room name!' });
  }
}
