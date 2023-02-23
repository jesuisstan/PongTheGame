import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatRoomDto, MessageDto } from './dto/chat.dto';

// Allow requests from the frontend port
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:' + process.env.FRONTEND_PORT],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('message') msg: MessageDto,
  ) {
    // Create a message object using the create method from chat.service
    const message = await this.chatService.createMessage(roomName, msg);
    console.log('message emitted: ' + Object.entries(msg));
    // Broadcast received message to all users
    this.server.emit('createMessage', message);
  }

  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @MessageBody('room') room: ChatRoomDto,
    @MessageBody('nick') nick: string,
  ) {
    if (room.password) room.modes += 'p';
    // Create a chat room object using the create method from chat.service
    await this.chatService.createChatRoom(room, nick);
    console.log('chatRoom emitted: ' + Object.entries(room));
    // Broadcast newly created room to all users
    this.server.emit('createChatRoom', room.name);
  }

  @SubscribeMessage('findAllMessages')
  findAllMessages(@MessageBody('roomName') roomName: string) {
    return this.chatService.findAllMessages(roomName);
  }

  @SubscribeMessage('findAllChatRooms')
  findAllChatRooms() {
    return this.chatService.findAllChatRooms();
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('nickName') nick: string,
  ) {
    await this.chatService.identify(roomName, nick, '');
    const room = this.chatService.getChatRoomByName(roomName);
    room?.bannedNicks.forEach((nickname) => {
      if (nickname === nick) throw new WsException('User is blocked.');
    });
    return room;
  }

  @SubscribeMessage('quitRoom')
  quitRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userName') userName: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.quitRoom(roomName, userName, client.id);
    this.server.emit('quitRoom', userName);
  }

  @SubscribeMessage('ping')
  ping() {
    this.server.emit('ping');
  }

  @SubscribeMessage('typingMessage')
  async typingMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('nickname') nick: string,
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('typingMessage', { roomName, nick, isTyping });
  }

  @SubscribeMessage('isPasswordProtected')
  async isPasswordProtected(@MessageBody('roomName') roomName: string) {
    const room = await this.chatService.getChatRoomByName(roomName);
    return room?.password ? true : false;
  }

  @SubscribeMessage('checkPassword')
  async checkPassword(
    @MessageBody('roomName') roomName: string,
    @MessageBody('password') password: string,
  ) {
    const room = await this.chatService.getChatRoomByName(roomName);
    return room?.password === password ? true : false;
  }
}
