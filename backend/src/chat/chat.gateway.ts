import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

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
  async create(@MessageBody() body: CreateMessageDto) {
    // Create a message object using the create method from chat.service
    const message = await this.chatService.create(body);
    console.log('message emitted: ' + body);
    // Broadcast received message to all users
    this.server.emit('createMessage', message);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody('userName') userName: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.chatService.identify(userName, client.id);
  }

  @SubscribeMessage('typingMessage')
  async typingMessage(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const userName = await this.chatService.getClientNameById(client.id);
    client.broadcast.emit('typingMessage', { userName, isTyping });
  }
}
