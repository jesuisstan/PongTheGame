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
  createMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('message') msg: MessageDto,
  ) {
    // Create a message object using the create method from chat.service,
    // but only is the user hasn't been muted
    if (msg) {
      if (
        msg.author.id &&
        this.chatService.isUserMuted(roomName, msg.author.id) === false
      )
        this.chatService.createMessage(roomName, msg);
      console.log('message emitted: ' + Object.entries(msg));
      // Broadcast received message to all users
      this.server.emit('createMessage');
    }
    throw new WsException({
      msg: 'createMessage: message is empty!',
    });
  }

  @SubscribeMessage('createChatRoom')
  createChatRoom(
    @MessageBody('room') room: ChatRoomDto,
    @MessageBody('userId') userId: number,
    @MessageBody('user2Id') user2Id: number,
  ) {
    // First, check if the room name already exists
    const r = this.chatService.getChatRoomByName(room.name);
    if (r) {
      if (!user2Id)
        throw new WsException({
          msg: 'createChatRoom: room name is already taken!',
        });
      else return;
    }
    // Set 'password protected' mode
    if (room.password) room.modes = 'p';
    // Set 'private' mode. This is a conversation between
    // 2 users, which is basically a chat room with 2 users
    if (user2Id) room.modes = 'i';
    // Create a chat room and set user as admin
    this.chatService.createChatRoom(room, userId, user2Id);
    if (!user2Id) {
      console.log('chatRoom emitted: ' + Object.entries(room));
      // Broadcast newly created room to all users
      this.server.emit('createChatRoom', room.name);
    }
  }

  @SubscribeMessage('findAllMessages')
  findAllMessages(@MessageBody('roomName') roomName: string) {
    return this.chatService.findAllMessages(roomName);
  }

  @SubscribeMessage('findAllChatRooms')
  findAllChatRooms() {
    return this.chatService.findAllChatRooms();
  }

  @SubscribeMessage('findAllMembers')
  findAllMembers(@MessageBody('roomName') roomName: string) {
    return this.chatService.findAllMembers(roomName);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    if (this.isUserBanned(roomName, userId) === true)
      throw new WsException({ msg: 'joinRoom: User is banned.' });
    this.chatService.identify(roomName, userId, '', true);

    this.server.emit('joinRoom', roomName, userId);
    return roomName;
  }

  @SubscribeMessage('quitRoom')
  quitRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    this.chatService.quitRoom(roomName, userId);
    this.server.emit('quitRoom', roomName, userId);
  }

  @SubscribeMessage('typingMessage')
  typingMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('typingMessage', roomName, userId, isTyping);
  }

  @SubscribeMessage('isPasswordProtected')
  isPasswordProtected(@MessageBody('roomName') roomName: string) {
    const room = this.chatService.getChatRoomByName(roomName);
    return room?.password ? true : false;
  }

  @SubscribeMessage('checkPassword')
  checkPassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('password') password: string,
  ) {
    const room = this.chatService.getChatRoomByName(roomName);
    return room?.password === password ? true : false;
  }

  @SubscribeMessage('changePassword')
  changePassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('currentPassword') currentPassword: string,
    @MessageBody('newPassword') newPassword: string,
  ) {
    // First, check the current password
    if (newPassword && this.checkPassword(roomName, currentPassword) === false)
      throw new WsException({ msg: 'changePassword: wrong password!' });
    this.chatService.changePassword(roomName, newPassword);
    const isDeleted = newPassword ? false : true;
    this.server.emit('changePassword', roomName, isDeleted);
  }

  @SubscribeMessage('isUserOper')
  isUserOper(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return this.chatService.isUserOper(roomName, userId);
  }

  // Give a target user the oper status
  @SubscribeMessage('makeOper')
  makeOper(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (this.isUserOper(roomName, userId) === false)
      throw new WsException({ msg: 'makeOper: user is not oper!' });
    this.chatService.makeOper(roomName, target);
    this.server.emit('makeOper', roomName, target);
  }

  @SubscribeMessage('banUser')
  banUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (this.isUserOper(roomName, userId) === false)
      throw new WsException({ msg: 'banUser: user is not oper!' });
    this.chatService.banUser(roomName, target);
    this.chatService.quitRoom(roomName, target);
    this.server.emit('banUser', roomName, target);
  }

  @SubscribeMessage('unBanUser')
  unBanUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (this.isUserOper(roomName, userId) === false)
      throw new WsException({ msg: 'unBanUser: user is not oper!' });
    this.chatService.unBanUser(roomName, target);
    this.server.emit('unBanUser', roomName, target);
  }

  @SubscribeMessage('isUserBanned')
  isUserBanned(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return this.chatService.isUserBanned(roomName, userId);
  }

  @SubscribeMessage('kickUser')
  kickUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
  ) {
    // First, check if the user has the admin rights
    if (this.isUserOper(roomName, userId) === false)
      throw new WsException({ msg: 'kickUser: user is not oper!' });
    this.chatService.quitRoom(roomName, target);
    this.server.emit('kickUser', roomName, target);
  }

  // Give a target user the muted status
  @SubscribeMessage('muteUser')
  muteUser(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
    @MessageBody('target') target: number,
    @MessageBody('mute') mute: boolean,
  ) {
    // First, check if the user has the admin rights
    if (this.isUserOper(roomName, userId) === false)
      throw new WsException({ msg: 'muteUser: user is not oper!' });
    if (mute === true) {
      this.chatService.muteUser(roomName, target);
      this.server.emit('muteUser', roomName, target);
    } else {
      this.chatService.unMuteUser(roomName, target);
      this.server.emit('unMuteUser', roomName, target);
    }
  }

  @SubscribeMessage('isUserMuted')
  isUserMuted(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userId') userId: number,
  ) {
    return this.chatService.isUserMuted(roomName, userId);
  }

  @SubscribeMessage('saveBlockedUsersToDB')
  async saveBlockedUsersToDB(
    @MessageBody('user') user: User,
    @MessageBody('blockedUsers') blockedUsers: number[],
  ) {
    const { id } = user;

    await this.prisma.user.update({
      data: {
        blockedUsers,
      },
      where: {
        id,
      },
    });
  }
}
