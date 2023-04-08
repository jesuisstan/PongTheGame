import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatRoomDto, MessageDto } from './dto/chat.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// Allow requests from the frontend port
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  websocket: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('message') msg: MessageDto,
  ) {
    // Create a message object using the create method from chat.service,
    // but only is the user hasn't been muted
    if (msg) {
      if (
        msg.author.id &&
        await this.chatService.isUserMuted(roomName, msg.author.id) === false
      )
      await this.chatService.createMessage(roomName, msg);
      console.log('message emitted: ' + Object.entries(msg));
      // Broadcast received message to all users
      await this.server.emit('createMessage');
    }
    else
      throw new WsException({ msg: 'createMessage: message is empty!', });
  }

  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @MessageBody('room') room: ChatRoomDto,
    @MessageBody('user1') user1: User,
    @MessageBody('user2') user2: User,
    ) {
    // First, check if the room name already exists
    const r = await this.chatService.getChatRoomByName(room.name);
    if (r) {
      // Throw error if both roooms are in the same category (private/public)
      if (((r.modes.search('i') !== -1) && (user2)) ||
        ((r.modes.search('i') === -1) && (room.modes.search('i') === -1)))
        throw new WsException({
          msg: 'createChatRoom: room name is already taken!',
        });
    }
    // In case of a private room, the name of the room is in the form:
    // #user1user2 => avoid creating doubles in the form #user2user1
    if (user2)
    {
      const roomName = '#' + user2.nickname + '/' + user1.nickname;
      console.log('roomNammmme ' + roomName)
      const privRoom = await this.chatService.getChatRoomByName(roomName);
      if (privRoom)
        throw new WsException({
          msg: 'createChatRoom: room name is already taken!',
        });
  }
    // Set 'password protected' mode
    if (room.password) room.modes = 'p';
    // Set 'private' mode. This is a conversation between
    // 2 users, which is basically a chat room with 2 users
    if (user2) room.modes = 'i';
    // Create a chat room and set user as admin
    await this.chatService.createChatRoom(room, user1.id, user2.id);
    if (!user2) {
      console.log('chatRoom emitted: ' + Object.entries(room));
      // Broadcast newly created room to all users
      this.server.emit('createChatRoom', room.name);
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(@MessageBody('roomName') roomName: string) {
    return await this.chatService.findAllMessages(roomName);
  }

  @SubscribeMessage('findAllChatRooms')
  async findAllChatRooms() {
    return await this.chatService.findAllChatRooms();
  }

  @SubscribeMessage('findAllMembers')
  async findAllMembers(@MessageBody('roomName') roomName: string) {
    return await this.chatService.findAllMembers(roomName);
  }

  @SubscribeMessage('findAllBannedMembers')
  async findAllBannedMembers(@MessageBody('roomName') roomName: string) {
    return await this.chatService.findAllBannedMembers(roomName);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    if (await this.chatService.isUserBanned(roomName, userId) === true)
      throw new WsException({ msg: 'joinRoom: User is banned.' });
    await this.chatService.identify(roomName, userId, '', true);
    this.server.emit('joinRoom', roomName, userId);
    return roomName;
  }

  @SubscribeMessage('quitRoom')
  async quitRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
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

  @SubscribeMessage('checkPassword')
  async checkPassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('password') password: string,
  ) {
    return await this.chatService.checkPassword(roomName, password);
  }

  @SubscribeMessage('changePassword')
  async changePassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('currentPassword') currentPassword: string,
    @MessageBody('newPassword') newPassword: string,
  ) {
    // First, check the current password
    if (newPassword && newPassword !== '' &&
      await this.checkPassword(roomName, currentPassword) === false)
      throw new WsException({ msg: 'changePassword: wrong password!' });
    await this.chatService.changePassword(roomName, newPassword);
    const isDeleted = newPassword && newPassword !== '' ? false : true;
    this.server.emit('changePassword', roomName, isDeleted);
  }

  @SubscribeMessage('isUserAdmin')
  async isUserAdmin(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return await this.chatService.isUserAdmin(roomName, userId);
  }

  // Give a target user the oper status
  @SubscribeMessage('makeAdmin')
  async makeAdmin(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (await this.isUserAdmin(roomName, userId) === false)
      throw new WsException({ msg: 'makeAdmin: user is not oper!' });
    await this.chatService.makeAdmin(roomName, target);
    this.server.emit('makeAdmin', roomName, target);
  }

  @SubscribeMessage('banUser')
  async banUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (await this.isUserAdmin(roomName, userId) === false)
      throw new WsException({ msg: 'banUser: user is not oper!' });
    await this.chatService.banUser(roomName, target);
    this.server.emit('banUser', roomName, target);
  }

  @SubscribeMessage('unBanUser')
  async unBanUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (await this.isUserAdmin(roomName, userId) === false)
      throw new WsException({ msg: 'unBanUser: user is not oper!' });
    await this.chatService.unBanUser(roomName, target);
    this.server.emit('unBanUser', roomName, target);
  }

  @SubscribeMessage('isUserBanned')
  async isUserBanned(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return await this.chatService.isUserBanned(roomName, userId);
  }

  @SubscribeMessage('kickUser')
  async kickUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (await this.isUserAdmin(roomName, userId) === false)
      throw new WsException({ msg: 'kickUser: user is not oper!' });
    await this.chatService.quitRoom(roomName, target);
    this.server.emit('kickUser', roomName, target);
  }

  // Give a target user the muted status
  @SubscribeMessage('muteUser')
  async muteUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
    @MessageBody('mute') mute: boolean,
  ) {
    // First, check if the user has the admin rights
    if (await this.isUserAdmin(roomName, userId) === false)
      throw new WsException({ msg: 'muteUser: user is not oper!' });
    if (mute === true) {
      await this.chatService.muteUser(roomName, target);
      this.server.emit('muteUser', roomName, target);
    } else {
      await this.chatService.unMuteUser(roomName, target);
      this.server.emit('unMuteUser', roomName, target);
    }
  }

  @SubscribeMessage('isUserMuted')
  async isUserMuted(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return await this.chatService.isUserMuted(roomName, userId);
  }

  @SubscribeMessage('saveBlockedUserToDB')
  async saveBlockedUsersToDB(
    @MessageBody('user') user: User,
    @MessageBody('blockedUsers') blockedUsers: number[],
  ) {
    const { id } = user;
    await this.prisma.user.update({
      data: {blockedUsers},
      where: {id},
    });
  }
}