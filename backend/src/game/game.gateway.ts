import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';
@WebSocketGateway()
export class GameGateway {
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

  @SubscribeMessage('match_training')
  async training(socket: Socket, payload: any) {
    this.game.create_training_game(socket);
  }

  @SubscribeMessage('match_leave')
  async leave(socket: Socket, payload: any) {
    this.game.leave_game(socket);
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

  @SubscribeMessage('match_get_invitation')
  async getInvitation(socket: any, payload: any) {
    if (
      !socket ||
      !payload ||
      !payload.obstacle ||
      !payload.winscore ||
      !payload.nickname
    ) {
      this.websockets.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Error backend on creation',
      });
      return;
    }
    this.game.create_invitation(socket, payload);
  }

  @SubscribeMessage('match_invitation_accept')
  async match_invitation_accept(socket: Socket, payload: any) {
    // Need the from | win score | obstacle
    if (
      !socket ||
      !payload ||
      !payload.winscore ||
      !payload.obstacle ||
      !payload.from.nickname
    ) {
      this.websockets.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Information missing',
      });
      return;
    }
    this.game.game_friend_start(socket, payload);
    return;
  }

  @SubscribeMessage('match_invitation_refuse')
  async match_invitation_refuse(socket: Socket, payload: any) {
    // Need the from
    if (!socket || !payload || !payload.from.nickname) {
      this.websockets.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Information missing',
      });
      return;
    }
    this.game.refuseInvitation(socket, payload);
    return;
  }

  @SubscribeMessage('match_spectate_leave')
  async spectateLeave(socket: any) {
    const game = this.game.get_game_where_spectator_is(socket.user.id);
    if (!game) return;
    game.remove_spectator(socket);
  }
}
