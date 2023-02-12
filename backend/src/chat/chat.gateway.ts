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
import { messageDto, chatRoomDto } from './dto/chat.dto';
import { chatRoom } from './entities/chat.entity';

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
  async createMessage(@MessageBody() body: messageDto) {
    // Create a message object using the create method from chat.service
    const message = await this.chatService.createMessage(body);
    console.log('message emitted: ' + body.data);
    // Broadcast received message to all users
    this.server.emit('createMessage', message);
  }

  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() body: chatRoomDto) {
    // Create a chat room object using the create method from chat.service
    const chatRoom = await this.chatService.createChatRoom(body);
    console.log('chatRoom emitted: ' + body.name);
    // Broadcast newly created room to all users
    this.server.emit('createChatRoom', chatRoom);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.chatService.findAllMessages();
  }

  @SubscribeMessage('findAllChatRooms')
  findAllChatRooms() {
    return this.chatService.findAllChatRooms();
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody('room') room: chatRoomDto,
    @MessageBody('user') user: User,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.identify(room, user, client.id);
    // this.server.emit('joinRoom', room);
    return room;
    // return roomName;
    // return this.chatService.identify(roomName, nickName, client.id);
  }

  @SubscribeMessage('typingMessage')
  async typingMessage(
    @MessageBody('room') room: chatRoomDto,
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.chatService.getUserById(room, client.id);
    const nickname = user.nickname;
    client.broadcast.emit('typingMessage', { nickname, isTyping });
  }
}
