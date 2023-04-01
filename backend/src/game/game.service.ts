import { Injectable } from '@nestjs/common';
import { User, StatusUser } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Game } from './game.class';
import { Socket } from 'socket.io';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { TypeMode } from './Interface';
import { convert_invitation } from './create_state';

@Injectable()
export class GameService {
  private game_queue: Socket[] = [];
  games: Game[] = [];

  constructor(
    private readonly websocket: WebsocketsService,
    private readonly prisma: PrismaService,
    private readonly achievement: giveAchievementService,
  ) {}

  async join_queue(socket: any) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: socket.user.id },
    });
    if (!user) return;
    socket.user.profile = user.profileId;
    this.register_quit(socket);
    this.game_queue.push(socket);
    this._treat_queue(this.game_queue);
  }

  async create_invitation(socket: any, payload: any) {
    const user: { id: number; status: StatusUser } | null =
      await this.prisma.user.findUnique({
        where: {
          nickname: payload.nickname,
        },
        select: {
          id: true,
          status: true,
        },
      });
    if (!user) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'User not found',
      });
      return;
    }
    if (user.status == 'PLAYING') {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'User already in game',
      });
      return;
    }
    const already_exist = await this.prisma.matchInvitation.findMany({
      where: {
        createdById: socket.user.id,
        sendToId: user.id,
      },
    });
    if (already_exist) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Invitation already send',
      });
      return;
    }
    const invited_socket: Socket[] = this.websocket.getSockets([user.id]);
    if (!invited_socket || !invited_socket[0]) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'User offline',
      });
      return;
    }
    await this.prisma.matchInvitation.create({
      data: {
        createdById: socket.user.id,
        sendToId: user.id,
      },
    });
    const res = convert_invitation(socket, payload);
    this.websocket.send(invited_socket[0], 'invitation_game', res);
  }

  async game_friend_start(socket: any, payload: any) {
    // The user accepted the game invitation
    const type: TypeMode =
      payload.obstacle == true ? TypeMode.CUSTOM : TypeMode.NORMAL;
    const user: { id: number } | null = await this.prisma.user.findUnique({
      where: {
        nickname: payload.from.nickname,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Opponents not found',
      });
      return;
    }
    const sockets: any = this.websocket.getSockets([user.id]);
    if (!sockets[0]) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'Opponents log out',
      });
      return;
    }
    this._delete_user_invitations([user.id, socket.user.id]);
    const game = new Game(
      this.prisma,
      this.websocket,
      this.achievement,
      type,
      payload.winscore,
      { socket: sockets[0], user: sockets[0].user },
      { socket: socket, user: socket.user },
      payload.obstacle,
    );
    this.games.push(game);

    game.start(() => {
      this.games.splice(this.games.indexOf(game), 1);
    });
  }
  private async _delete_user_invitations(userId: number[]) {
    await this.prisma.matchInvitation.delete({
      where: {
        createdById: userId[0],
        sendToId: userId[1],
      },
    });
  }

  async refuseInvitation(socket: any, payload: any) {
    const user: { id: number } | null = await this.prisma.user.findUnique({
      where: {
        nickname: payload.from.nickname,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      this.websocket.send(socket, 'match_invitation_error', {
        status: 'error',
        error: 'User not found',
      });
      return;
    }
    this._delete_user_invitations([user.id, socket.user.id]);
  }
  async create_training_game(player: any) {
    const msg = {
      action: 'match',
      player1: {
        name: player.nickname,
        avatar: player.user.avatar,
      },
      player2: {
        name: 'AI',
        avatar: '',
      },
    };
    this.websocket.send(player, 'matchmaking', msg);
    const game = new Game(
      this.prisma,
      this.websocket,
      this.achievement,
      TypeMode.TRAINING,
      5,
      { socket: player, user: player.user },
    );
    this.games.push(game);
    game.start(() => {
      this.games.splice(this.games.indexOf(game), 1);
    });
  }

  private _treat_queue(queue: Socket[]) {
    if (queue.length >= 2) {
      const player1: any = queue.shift();
      const player2: any = queue.shift();
      const msg = {
        action: 'match',
        player1: {
          name: player1.nickname,
          avatar: player1.user.avatar,
        },
        player2: {
          name: player2.nickname,
          avatar: player2.user.avatar,
        },
      };
      this.websocket.send(player1, 'matchmaking', msg);
      this.websocket.send(player2, 'matchmaking', msg);
      const game = new Game(
        this.prisma,
        this.websocket,
        this.achievement,
        TypeMode.CUSTOM,
        5,
        { socket: player1, user: player1.user },
        { socket: player2, user: player2.user },
        true,
      );
      this.games.push(game);
      game.start(() => {
        this.games.splice(this.games.indexOf(game), 1);
      });
    }
  }

  register_quit(socket: Socket) {
    this.websocket.registerOnClose(socket, () => {
      this.cancel_queue(socket);
      this.leave_game(socket);
    });
  }

  cancel_queue(socket: any) {
    this.game_queue.splice(this.game_queue.indexOf(socket), 1);
  }

  leave_game(socket: any) {
    const game = this.get_game_where_player_is(socket.user.id);
    if (!game) return;
    game.leave(socket.user.id);
  }

  get_game_where_player_is(userId: number) {
    return this.games.find((game: Game) => game.get_player(userId) != null);
  }

  get_game_where_player_is_by_name(username: string) {
    return this.games.find(
      (game: Game) => game.get_player_by_name(username) != null,
    );
  }

  get_game_where_spectator_is(userId: number) {
    return this.games.find((game: Game) => game.get_spectator(userId) != null);
  }
}
