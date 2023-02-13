import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
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
  async createChatRoom(@MessageBody() room: ChatRoomDto) {
    // Create a chat room object using the create method from chat.service
    await this.chatService.createChatRoom(room);
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
    @MessageBody('user') user: User,
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.identify(roomName, user, client.id);
    const room = this.chatService.getChatRoomByName(roomName);
    return room;
  }

  @SubscribeMessage('quitRoom')
  async quitRoom(
    @MessageBody('roomName') roomName: string,
    @MessageBody('userName') userName: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.quitRoom(roomName, userName, client.id);
    this.server.emit('quitRoom', userName);
  }

  @SubscribeMessage('ping')
  ping() {
    this.server.emit('ping');
  }

  @SubscribeMessage('typingMessage')
  async typingMessage(
    @MessageBody('roomName') roomName: string,
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.chatService.getUserById(roomName, client.id);
    if (user) {
      const nickname = user.nickname;
      client.broadcast.emit('typingMessage', { roomName, nickname, isTyping });
    }
  }
}
