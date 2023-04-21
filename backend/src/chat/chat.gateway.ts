import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatRoomDto, MessageDto } from './dto/chat.dto';
import { Member } from './entities/chat.entity';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

// Allow requests from the frontend port
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  websocket: any;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('message') msg: MessageDto,
  ): Promise<void> {
    // Create a message object using the create method from chat.service,
    // but only is the user hasn't been muted
    if (msg) {
      if (
        msg.author.id &&
        (await this.chatService.isUserMuted(roomName, msg.author.id)) === false
      )
        await this.chatService.createMessage(roomName, msg);
      console.log('message emitted: ' + Object.entries(msg));
      // Broadcast received message to all users
      this.server.emit('createMessage');
    } else throw new WsException({ msg: 'createMessage: message is empty!' });
  }

  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @MessageBody('room') room: ChatRoomDto,
    @MessageBody('user1') user1: User,
    @MessageBody('avatar') avatar: string,
    @MessageBody('user2Id') user2Id: number | undefined,
    @MessageBody('user2Nick') user2Nick: string | undefined,
  ): Promise<number> {
    // First, check if max chat room limit hasn't been reached
    if (
      (await this.prisma.chatRoom.count()) >=
      parseInt(process.env.REACT_APP_MAX_CHATROOM_NBR!)
    ) {
      this.logger.verbose('createChatRoom: Max chat room number reached!');
      return 409;
    }
    // Then, check if the room name already exists
    const r: ChatRoomDto | null = await this.chatService.getChatRoomByName(
      room.name,
    );
    if (r) {
      // Throw error if both roooms are in the same category (private/public)
      if (
        (r.modes.search('i') !== -1 && user2Id) ||
        (r.modes.search('i') === -1 && room.modes.search('i') === -1)
      )
        this.logger.verbose('createChatRoom: room name is already taken!');
      return 412;
    }
    // In case of a private room, the name of the room is in the form:
    // #user1user2 => avoid creating doubles in the form #user2user1
    if (user2Id) {
      const roomName: string = '#' + user2Nick + '/' + user1.nickname;
      const privRoom: ChatRoomDto | null =
        await this.chatService.getChatRoomByName(roomName);
      if (privRoom) {
        this.logger.verbose('createChatRoom: room name is already taken!');
        return 412;
      }
    }
    // Set 'password protected' mode
    if (room.password) room.modes = 'p';
    // Set 'private' mode. This is a conversation between
    // 2 users, which is basically a chat room with 2 users
    if (user2Id) room.modes = 'i';
    // Create a chat room and set user as admin
    await this.chatService.createChatRoom(room, user1, avatar, user2Id);
    if (!user2Id) {
      console.log('chatRoom emitted: ' + Object.entries(room));
      // Broadcast newly created room to all users
      this.server.emit('createChatRoom', room.name);
    }
    return 0;
  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(
    @MessageBody('roomName') roomName: string,
  ): Promise<MessageDto[]> {
    return this.chatService.findAllMessages(roomName);
  }

  @SubscribeMessage('findAllChatRooms')
  async findAllChatRooms(): Promise<ChatRoomDto[]> {
    return this.chatService.findAllChatRooms();
  }

  @SubscribeMessage('findAllMembers')
  async findAllMembers(
    @MessageBody('roomName') roomName: string,
  ): Promise<Member[]> {
    return this.chatService.findAllMembers(roomName);
  }

  @SubscribeMessage('findAllBannedMembers')
  async findAllBannedMembers(
    @MessageBody('roomName') roomName: string,
  ): Promise<User[]> {
    return this.chatService.findAllBannedMembers(roomName);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('user') user: User,
    @MessageBody('avatar') avatar: string,
  ): Promise<ChatRoomDto | null> {
    const memberCount = await this.prisma.member.count({
      // First, get the current member count and compare it with the max allowed
      where: { chatRoomName: roomName },
    });
    if (memberCount >= parseInt(process.env.REACT_APP_MAX_CHATROOM_MEMBER_NBR!))
      throw new WsException({
        msg: 'joinRoom: Max chat room member number reached!',
      });

    if ((await this.chatService.isUserBanned(roomName, user.id)) === true)
      throw new WsException({ msg: 'joinRoom: User is banned.' });
    await this.chatService.identify(roomName, user, '', avatar, true);
    this.server.emit('joinRoom', roomName, user.id);
    return this.chatService.getChatRoomByName(roomName);
  }

  @SubscribeMessage('quitRoom')
  async quitRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ): Promise<void> {
    await this.chatService.quitRoom(roomName, userId);
    this.server.emit('quitRoom', roomName, userId);
  }

  @SubscribeMessage('typingMessage')
  typingMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('nick') nick: string,
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('typingMessage', roomName, nick, isTyping);
  }

  @SubscribeMessage('isPasswordProtected')
  async isPasswordProtected(@MessageBody('roomName') roomName: string) {
    return this.chatService.isPasswordProtected(roomName);
  }

  @SubscribeMessage('checkPassword')
  async checkPassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('password') password: string,
  ): Promise<boolean> {
    return this.chatService.checkPassword(roomName, password);
  }

  @SubscribeMessage('changePassword')
  async changePassword(
    @MessageBody('roomName') roomName: string,
    // @MessageBody('currentPassword') currentPassword: string,
    @MessageBody('newPassword') newPassword: string,
  ): Promise<void> {
    // // First, check the current password
    // if (
    //   newPassword &&
    //   newPassword !== '' &&
    //   (await this.checkPassword(roomName, currentPassword)) === false
    // )
    //   throw new WsException({ msg: 'changePassword: wrong password!' });
    await this.chatService.changePassword(roomName, newPassword);
    const isDeleted = newPassword && newPassword !== '' ? false : true;
    this.server.emit('changePassword', roomName, isDeleted);
  }

  @SubscribeMessage('hasUserPriv')
  async hasUserPriv(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ): Promise<boolean> {
    return this.chatService.hasUserPriv(roomName, userId, target);
  }

  // Toggle member modes inside a chat room
  @SubscribeMessage('toggleMemberMode')
  async toggleMemberMode(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
    @MessageBody('mode') mode: string,
    @MessageBody('off') off: boolean,
  ): Promise<void> {
    // First, check if the user has the admin rights
    if ((await this.hasUserPriv(roomName, userId, target)) === false)
      throw new WsException({
        msg: "muteUser: user doesn't have enough privileges!",
      });
    const room: ChatRoomDto | null = await this.chatService.getChatRoomByName(
      roomName,
    );
    if (room) {
      // Send the first character of the mode name; ex: mute => 'm'
      const modes: string = await this.chatService.modifyModes(
        room.members,
        target,
        mode[0],
        off,
      );
      // Save the new modes
      await this.chatService.updateUserModes(roomName, target, modes);
      // Create event name, ex: unmuteUser
      const event: string = (off ? 'un' : '') + mode + 'User';
      this.server.emit(event, roomName, target);
    }
  }

  @SubscribeMessage('banUser')
  async banUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
    @MessageBody('off') off: boolean,
  ): Promise<void> {
    const event: string = (off ? 'un' : '') + 'banUser';
    // First, check if the user has the admin rights
    if ((await this.hasUserPriv(roomName, userId, target)) === false)
      throw new WsException({
        msg: event + ": user doesn't have enough privileges!!",
      });
    if (off) {
      await this.chatService.unBanUser(roomName, target);
      await this.chatService.quitRoom(roomName, target);
    } else await this.chatService.banUser(roomName, target);
    this.server.emit(event, roomName, target);
  }

  @SubscribeMessage('kickUser')
  async kickUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ): Promise<void> {
    // First, check if the user has the admin rights
    if ((await this.hasUserPriv(roomName, userId, target)) === false)
      throw new WsException({
        msg: "kickUser: user doesn't have enough privileges!!",
      });
    await this.chatService.quitRoom(roomName, target);
    this.server.emit('kickUser', roomName, target);
  }

  @SubscribeMessage('updateBlockedUsers')
  updateBlockedUsers(
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
    @MessageBody('disconnect') disconnect: boolean,
  ): Promise<User | null> {
    return this.chatService.updateBlockedUsers(userId, target, disconnect);
  }
}
