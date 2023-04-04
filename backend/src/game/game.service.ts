import { Inject, forwardRef, Injectable } from '@nestjs/common';
import { User, StatusUser, MatchInvitation } from '@prisma/client';
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
    @Inject(forwardRef(() => WebsocketsService))
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

  async create_invitation(
    socket: any,
    payload: any,
  ): Promise<{ status: number; reason: string }> {
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
    if (!user) return { status: 403, reason: 'User not found' };
    if (user.status == 'PLAYING')
      return { status: 400, reason: 'User Already in game' };
    const already_exist = await this.prisma.matchInvitation.findMany({
      where: {
        createdById: socket.user.id,
      },
    });
    if (already_exist.length > 0)
      return { status: 400, reason: 'Invitation already send' };
    const invited_socket: Socket[] = this.websocket.getSockets([user.id]);
    if (!invited_socket || !invited_socket[0])
      return { status: 400, reason: 'User offline' };
    await this.prisma.matchInvitation.create({
      data: {
        createdById: socket.user.id,
        sendToId: user.id,
        winscore: payload.winscore,
        obstacle: payload.obstacle,
      },
    });
    const res = convert_invitation(socket, payload);
    this.websocket.send(invited_socket[0], 'invitation_game', res);
    return { status: 200, reason: 'Invitation send' };
  }

  async send_all_invitation(socket: any) {
    if (!socket) return;
    const allInvit = await this.prisma.matchInvitation.findMany({
      where: {
        sendToId: socket.user.id,
      },
      select: {
        createdBy: true,
        obstacle: true,
        winscore: true,
      },
    });
    for (let i = 0; i < allInvit.length; i++) {
      const res = convert_invitation(
        {
          user: {
            nickname: allInvit[i].createdBy.nickname,
            avatar: allInvit[i].createdBy.avatar,
          },
        },
        { obstacle: allInvit[i].obstacle, winscore: allInvit[i].winscore },
      );
      this.websocket.send(socket, 'invitation_game', res);
    }
  }

  async game_friend_start(
    socket: any,
    payload: any,
  ): Promise<{ status: number; reason: string }> {
    // The user accepted the game invitation
    const type: TypeMode =
      payload.obstacle == true ? TypeMode.CUSTOM : TypeMode.NORMAL;
    const user: { id: number } | null = await this.prisma.user.findUnique({
      where: {
        nickname: payload.nickname,
      },
      select: {
        id: true,
      },
    });
    if (!user) return { status: 403, reason: 'User not found' };
    const sockets: any = this.websocket.getSockets([user.id]);
    if (!sockets[0]) return { status: 400, reason: 'Opponents log out' };
    this.websocket.send(sockets[0], 'invitation_accepted', '');
    this.websocket.send(sockets[0], 'match_custom_start', '');
    this.websocket.send(socket, 'match_custom_start', '');
    this._delete_user_invitations(user.id);
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
    return { status: 200, reason: 'Game start' };
  }

  async game_abort(
    socket: any,
    nickname: string,
  ): Promise<{ status: number; reason: string }> {
    const userId: { id: number } | null = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      select: {
        id: true,
      },
    });
    if (!userId) return { status: 403, reason: 'User not found' };
    const invit = await this.prisma.matchInvitation.findUnique({
      where: {
        createdById: userId.id,
      },
    });
    if (!invit) return { status: 404, reason: 'Invitation not found' };
    this._delete_user_invitations(socket.user.id);
    return { status: 200, reason: 'Success' };
  }

  async delete_invitation(user: User) {
    const invit: MatchInvitation | null =
      await this.prisma.matchInvitation.findUnique({
        where: {
          createdById: user.id,
        },
      });
    if (!invit) return;
    this._delete_user_invitations(user.id);
  }

  private async _delete_user_invitations(createdID: number) {
    await this.prisma.matchInvitation.delete({
      where: {
        createdById: createdID,
      },
    });
  }

  async refuseInvitation(socket: any, payload: any) {
    const user: { id: number } | null = await this.prisma.user.findUnique({
      where: {
        nickname: payload.nickname,
      },
      select: {
        id: true,
      },
    });
    if (!user) return { status: 404, reason: 'user not found' };
    const socketUserCreate: Socket[] = this.websocket.getSockets([user.id]);
    this.websocket.send(socketUserCreate[0], 'invitation_refused', '');
    this._delete_user_invitations(user.id);
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
        TypeMode.NORMAL,
        5,
        { socket: player1, user: player1.user },
        { socket: player2, user: player2.user },
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
