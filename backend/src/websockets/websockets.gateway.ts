import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { WebsocketsService } from './websockets.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  constructor(private readonly websocketsService: WebsocketsService) {}

  @WebSocketServer() server: Server;
  async afterInit(serv: Server) {
    serv.on('connection', async (socket: Socket) => {
      await this.websocketsService.registerSocket(socket);
    });
  }

  async handleConnection(socket: Socket) {
    socket;
  }

  async handleDisconnect(socket: Socket) {
    this.websocketsService.unregisterSocket(socket);
  }
}
