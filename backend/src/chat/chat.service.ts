import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageDto, ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Member } from './entities/chat.entity';
import { User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async identify(
    roomName: string,
    user: User,
    modes: string,
    avatar: string,
    online: boolean,
  ): Promise<void> {
    // Check if room exists
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (!room) throw new WsException({ msg: 'identify: unknown room name!' });
    // Do nothing if user is already identified
    let found: boolean = false;
    let foundModes: string = '';
    for (let i = 0; i < room.members.length; ++i) {
      if (user.id === room.members[i].memberId) {
        found = true;
        foundModes = room.members[i].modes;
        // Do nothing and return if user is already a member and is online
        if (room.members[i].isOnline === online) return;
      }
    }
    if (found) // user is already a member but not online
      await this.prisma.member.update({
        where: {
          memberId_chatRoomName: {
            memberId: user.id,
            chatRoomName: roomName,
          },
        },
        data: { isOnline: online, modes: foundModes + modes },
      });
    else { // User is not a member yet
      await this.prisma.member.create({
        data: {
          memberId: user.id,
          nickName: user.nickname ? user.nickname : '',
          isOnline: online,
          modes: modes,
          avatar: avatar,
          chatRoomName: roomName,
        },
      });
    }
  }

  async quitRoom(roomName: string, userId: number): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      await this.prisma.member.update({
        where: {
          memberId_chatRoomName: {
            memberId: userId,
            chatRoomName: roomName,
          },
        },
        data: { isOnline: false },
      });
    } else throw new WsException({ msg: 'quitRoom: unknown room name!' });
  }

  async getChatRoomByName(name: string): Promise<ChatRoomDto | null> {
    return await this.prisma.chatRoom.findUnique({
      where: { name: name },
      include: {
        members: true,
        messages: {
          include: { author: true },
        },
        bannedUsers: true,
      },
    });
  }

  async createMessage(roomName: string, msg: MessageDto): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      await this.prisma.message.create({
        data: {
          authorId: msg.author.id,
          data: msg.data,
          timestamp: msg.timestamp,
          chatRoomName: roomName,
        },
      });
    } else throw new WsException({ msg: 'createMessage: unknown room name!' });
  }

  async generateHash(password: string): Promise<string> {
    // We use salt rounds, which is the cost factor (how much time is used to
    // compute the hash => the more elevated, the more difficult is brute-forcing)
    const saltRounds: number = 10;
    return await bcrypt
      .hash(password, saltRounds)
      .then((res: string) => res)
      .catch((err: any) => {
        throw new WsException({ msg: err.message });
      });
  }

  // Create a new chat room object and push it to the database
  // the creator will get owner privileges
  async createChatRoom(
    room: ChatRoomDto,
    user: User,
    avatar: string,
    user2Id: number | undefined,
  ): Promise<void> {
    if (room) {
      // Hash the password before saving it
      const hash: string = room.password
        ? await this.generateHash(room.password)
        : '';
      // Save room to the database
      const r = await this.prisma.chatRoom.create({
        data: {
          name: room.name,
          owner: user.id,
          modes: room.modes,
          password: hash,
          userLimit: room.userLimit,
          members: {},
          messages: {},
          bannedUsers: {},
        },
      });
      console.log('created room: ' + Object.entries(r));
      // If it is a private conversation
      if (user2Id) {
        user.avatar &&
          (await this.identify(room.name, user, '', user.avatar, false));
        const user2: User | null = await this.prisma.user.findUnique({
          where: { id: user2Id },
        });
        user2 &&
          user2.avatar &&
          (await this.identify(room.name, user2, '', user2.avatar, false));
        return;
      }
      // Identify creator as the owner
      this.identify(room.name, user, 'o', avatar, false);
    } else
      throw new WsException({
        msg: "createChatRoom: 'room' argument is missing!",
      });
  }

  // Return all messages from the chatroom
  async findAllMessages(roomName: string): Promise<MessageDto[]> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room)
      return await this.prisma.message.findMany({
        where: { chatRoomName: roomName },
        include: {
          author: { 
            include: { blockedUsers: true, blockedBy: true }
          },
        },
      });
    throw new WsException({ msg: 'findAllMessages: unknown room name!' });
  }

  async findAllChatRooms(): Promise<any[]> {
    return await this.prisma.chatRoom.findMany({ include: { members: true } });
  }

  // Return all members from the chatroom
  async findAllMembers(roomName: string): Promise<Member[]> {
    return await this.prisma.member.findMany({
      where: { chatRoomName: roomName },
    });
  }

  // Return all banned members from the chatroom
  async findAllBannedMembers(roomName: string): Promise<User[]> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) return room.bannedUsers;
    else
      throw new WsException({
        msg: 'findAllBannedMembers: unknown room name!',
      });
  }

  async isPasswordProtected(roomName: string) {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      return room.password && room.password !== '' ? true : false;
    } else
      throw new WsException({ msg: 'isPasswordProtected: unknown room name!' });
  }

  async changePassword(roomName: string, newPassword: string): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      const oldModes = await this.prisma.chatRoom.findUnique({
        where: { name: roomName },
        select: { modes: true },
      });
      if (oldModes) {
        if (newPassword && newPassword !== '') {
          newPassword = await this.generateHash(newPassword);
          // If the room wasn't in 'password protected' mode,
          // it gets it
          // If 'p' mode already there, we keep the old modes
          const newModes: string =
            oldModes.modes.search('p') !== -1
              ? oldModes.modes
              : oldModes.modes + 'p';
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: {
              modes: newModes,
              password: newPassword,
            },
          });
        } // No given password means we remove the password
        else {
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: { password: '' },
          }); // and we remove the 'password protected' mode
          if (oldModes.modes.search('p') !== -1) {
            const modes: string = oldModes.modes.replace(/p/g, '');
            await this.prisma.chatRoom.update({
              where: { name: roomName },
              data: { modes: modes },
            });
          }
        }
      }
    } else throw new WsException({ msg: 'changePassword: unknown room name!' });
  }

  async hasUserPriv(
    roomName: string,
    userId: number,
    target: number,
  ): Promise<boolean> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      // If target is the owner, we stop here: cannot do anything against owners
      if (target === room.owner) return false;
      // Look for the user asking for privilege
      for (let i = 0; i < room.members.length; ++i) {
        if (room.members[i].memberId === userId) {
          // If user is neither owner or admin, we stop here
          if (userId !== room.owner && room.members[i].modes.search('a') === -1)
            return false;
          // Otherwise, there is no reason not to give privilege
          return true;
        }
      }
      throw new WsException({
        msg: 'hasUserPriv: unknown member in [' + roomName + ']!',
      });
    }
    throw new WsException({ msg: 'hasUserPriv: unknown room name!' });
  }

  // Look for mode in user's mode and add mode if not already there
  modifyModes(
    members: Member[],
    userId: number,
    mode: string,
    del: boolean,
  ): string {
    let modes: string = '';
    for (let i = 0; i < members.length; ++i) {
      if (members[i].memberId === userId) {
        modes = members[i].modes;
        if (!del && members[i].modes.search(mode) === -1) modes += mode;
        else if (del) {
          const regex = new RegExp(mode, 'g');
          modes = modes.replace(regex, '');
        }
      }
    }
    return modes;
  }

  async updateUserModes(
    roomName: string,
    userId: number,
    modes: string,
  ): Promise<void> {
    await this.prisma.member.update({
      where: {
        memberId_chatRoomName: {
          memberId: userId,
          chatRoomName: roomName,
        },
      },
      data: { modes: modes },
    });
  }

  async makeAdmin(roomName: string, userId: number): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      const modes: string = this.modifyModes(room.members, userId, 'a', false);
      // Save the new modes
      await this.updateUserModes(roomName, userId, modes);
    } else throw new WsException({ msg: 'makeAdmin: unknown room name!' });
  }

  async banUser(roomName: string, userId: number): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        // user.id is loaded inside bannedUsers
        // If not already banned, push the new user into it
        if ((await this.isUserBanned(roomName, userId)) === false) {
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: { bannedUsers: { connect: { id: userId } } },
          });
        } else
          throw new WsException({ msg: 'unBanUser: user is already banned!' });
      }
    } else throw new WsException({ msg: 'banUser: unknown room name!' });
  }

  async unBanUser(roomName: string, userId: number): Promise<void> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      if (userId) {
        if ((await this.isUserBanned(roomName, userId)) === true) {
          // If banned, delete the user from the list
          await this.prisma.chatRoom.update({
            where: { name: roomName },
            data: { bannedUsers: { disconnect: { id: userId } } },
          });
        } else throw new WsException({ msg: 'unBanUser: user is not banned!' });
      }
    } else throw new WsException({ msg: 'unBanUser: unknown room name!' });
  }

  async isUserBanned(roomName: string, userId: number): Promise<boolean> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      for (let i = 0; i < room.bannedUsers.length; ++i)
        if (room.bannedUsers[i].id === userId) return true;
      return false;
    } else throw new WsException({ msg: 'isUserBanned: unknown room name!' });
  }

  async isUserMuted(roomName: string, userId: number): Promise<boolean> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      // Look for mute mode ('m') in user's modes
      for (let i = 0; i < room.members.length; ++i)
        if (
          room.members[i].memberId === userId &&
          room.members[i].modes.search('m') !== -1
        )
          return true;
      return false;
    }
    throw new WsException({ msg: 'isUserMuted: unknown room name!' });
  }

  async checkPassword(roomName: string, password: string): Promise<boolean> {
    const room: ChatRoomDto | null = await this.getChatRoomByName(roomName);
    if (room) {
      // Compare bcrypted stored pwd from the database to the user's given password
      // bcrypt will hash the given pwd then compared it to the stored hashed pwd
      return await bcrypt.compare(password, room.password);
    } else throw new WsException({ msg: 'checkPassword: unknown room name!' });
  }

  async updateBlockedUsers(userId: number, target: number, disconnect: boolean)
    : Promise<User | null> {
    if (disconnect) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          blockedUsers: {
            disconnect: { id: target },
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          blockedUsers: {
            connect: { id: target },
          },
        },
      });
    }
    var u= await this.prisma.user.findUnique({
      where: { id: userId },
      include: { blockedUsers: true, blockedBy: true }
    })
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { blockedUsers: true, blockedBy: true }
    })
  }

  async findBlockedBy(userId: number)
  : Promise<User[] | null> {
    const res  = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { blockedBy: true }
    });
    return res ? res.blockedBy : null;
  }
}
