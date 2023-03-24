import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  // cors: {
  //   origin: true,
  // },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly game: GameService,
    private readonly prisma: PrismaService,
    private readonly websockets: WebsocketsService,
  ) {}

  @SubscribeMessage('match_making')
  async matchmaking(socket: Socket, payload: any) {
    if (!payload || !payload.action) return;
    switch (payload.action) {
      case 'join':
        this.game.join_queue(socket);
        break;
      case 'cancel':
        this.game.cancel_queue(socket);
        break;
      case 'leave':
        this.game.leave_game(socket);
        break;
    }
  }

  @SubscribeMessage('match_game_input')
  async gameInput(socket: any, payload: any) {
    if (!payload || !payload.action || !payload.direction) return;
    const game = this.game.get_game_where_player_is(socket.user.id);
    if (!game) return;
    game.process_input(socket.user.id, payload);
  }

  @SubscribeMessage('match_spectate')
  async spectateMatch(socket: any, payload: any) {
    if (!payload || !payload.id) return;
    const game = this.game.get_game_where_player_is(payload.id);
    if (!game) {
      this.websockets.send(socket, 'match_spectate', {
        status: 'error',
        error: 'Game not found',
      });
      return;
    }
    this.websockets.send(socket, 'match_spectate', {
      status: 'success',
    });
    game.add_spectator(socket);
  }

  @SubscribeMessage('match_name_spectate')
  async spectateMatchName(socket: any, payload: any) {
    if (!payload || !payload.name) return;
    const game = this.game.get_game_where_player_is_by_name(payload.name);
    if (!game) {
      this.websockets.send(socket, 'match_spectate', {
        status: 'error',
        error: 'Game not found',
      });
      return;
    }
    this.websockets.send(socket, 'match_spectate', {
      status: 'success',
    });
    game.add_spectator(socket);
  }

  @SubscribeMessage('match_send_invitation') // Send match invitation
  async invitation_match(socket: any, payload: any) {
    // Inside the payload need to have the second user socket
    this.websockets.send(
      payload.opponent.socket[1],
      'invitation_notification',
      {},
    ); // TODO send invitation to a user
    // this.game.create_friend_game([socket, payload.opponent.socket], payload.opponent.socket.id)
    // const game = this.game.get_game_where_spectator_is(socket.user.id);
    // if (!game) return;
    // game.remove_spectator(socket);
  }

  @SubscribeMessage('match_invitation_accept')
  async invitation_match_accept(socket: any, payload: any) {
    // Inside the payload need to have the second user socket
    console.log(socket);
    console.log(payload);
    // this.game.create_friend_game([socket, payload.opponent.socket], payload.opponent.socket.id);
  }

  @SubscribeMessage('match_spectate_leave')
  async spectateLeave(socket: any) {
    const game = this.game.get_game_where_spectator_is(socket.user.id);
    if (!game) return;
    game.remove_spectator(socket);
  }
}
