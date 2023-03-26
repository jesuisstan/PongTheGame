import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Socket } from 'socket.io';
import { FriendService } from './friends.service';

@WebSocketGateway()
export class GameGateway {
  constructor(
    private readonly friends: FriendService, //   private readonly websockets: WebsocketsService,
  ) {}

  @SubscribeMessage('add_friends')
  async addFriends(socket: Socket, payload: any) {
    this.friends.addFriend(socket, payload);
  }

  @SubscribeMessage('cancel_friends_request')
  async cancelRequest(socket: Socket, payload: any) {
    this.friends.cancelRequest(socket, payload);
  }

  // @SubscribeMessage('accept_friends_request')
  // async acceptRequest(socket: Socket, payload: any) {}
}
