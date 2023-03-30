import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Game } from './game.class';
import { Socket } from 'socket.io';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { TypeMode } from './Interface';

@Injectable()
export class GameService {
  private game_queue: Socket[] = [];
  games: Game[] = [];
  private invitation: number[] = [];

  constructor(
    private readonly websocket: WebsocketsService,
    private readonly prisma: PrismaService,
    private readonly achievement: giveAchievementService,
  ) {}

  async join_queue(socket: any) {
    console.log(socket.user);
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: socket.user.id },
    });
    if (!user) return;
    socket.user.profile = user.profileId;
    this.register_quit(socket);
    this.game_queue.push(socket);
    this._treat_queue(this.game_queue);
  }

  async create_friend_game(id: number[]) {
    this.invitation.push(id[1]);

    await this.prisma.user.update({
      where: {
        id: id[0],
      },
      data: {
        invitation: {
          create: [
            {
              id: id[1],
              sendToId: id[1],
            },
          ],
        },
      },
    });

    console.log(this.websocket.getSockets([id[0]]));
    const notif_socket = this.websocket.getSockets([id[1]]);
    this.websocket.send(notif_socket, 'game_invite_notification', {}); // MEMO emit for the notification
    // TODO probably send the player who send the invited + WINING_SCORE for create the game after
  }

  async game_friend_start(id: number[]) {
    // need to get hte socket from the id
    const sockets: any = this.websocket.getSockets(id);
    const game = new Game(
      this.prisma,
      this.websocket,
      this.achievement,
      TypeMode.NORMAL,
      5,// Get from parameters
      { socket: sockets[0], user: sockets[0].user },
      { socket: sockets[1], user: sockets[1].user },
      this.invitation,
      // Add the obstacle if the user want
    );
    this.games.push(game);

    game.start(() => {
      this.games.splice(this.games.indexOf(game), 1);
    });
  }
  private async _delete_user_invitations(userId: number[]) {
    this.invitation.splice(this.invitation.indexOf(userId[1]), 1);
    // TODO check how to delete the game
    // await this.prisma.matchInvitation.delete({ // FIXME Dosent work check
    //   where :
    //   {
    //     sendToId : userId[1],
    //   }
    // });
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
        TypeMode.CUSTOM, // TODO modified  for normal
        5,
        { socket: player1, user: player1.user },
        { socket: player2, user: player2.user },
        true, // TODO delete this
        true,// TODO delete this
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
