import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AchievementService } from 'src/achievement/achievement.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Game } from './game.class';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
  private readonly user: User[] = [];
  private game_queue: Socket[] = [];
  games: Game[] = [];
  private invitation: number[] = [];

  constructor(
    private readonly websocket: WebsocketsService,
    private readonly prisma: PrismaService,
    private readonly achievement: AchievementService,
  ) {}

  async join_queue(socket: any) {
    // type = type.toUpperCase();
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: socket.user.id },
      // include: { profile: true },
    });
    if (!user) return;
    socket.user.profile = user.profileId;
    // this.register_quit(socket);
    this.game_queue.push(socket);
    this._treat_queue(this.game_queue);
  }

  // private async _delete_user_invitations(userId: number) {
  // 	const invitation = await this.prismaService.matchInvitation.findUnique({
  // 		where: { createdById: userId },
  // 		include: {
  // 			createdBy: true,
  // 			message: {
  // 				include: {
  // 					channel: {
  // 						include: {
  // 							participants: true,
  // 						},
  // 					},
  // 				},
  // 			},
  // 		},
  // 	});
  // 	if (!invitation) return;
  // 	await this.prismaService.messageOnChannel.delete({
  // 		where: { id: invitation.message.id },
  // 	});
  // 	await this.prismaService.matchInvitation.delete({
  // 		where: { id: invitation.id },
  // 	});
  // 	this.websocketsService.sendToAllUsers(
  // 		invitation.message.channel.participants.map((p) => p.userId),
  // 		'chat-delete',
  // 		{
  // 			type: 'invitation',
  // 			createdBy: invitation.createdBy.name,
  // 			channel: invitation.message.channel.id,
  // 		},
  // 	);
  // }

  private _treat_queue(queue: Socket[]) {
    if (queue.length >= 2) {
      const player1: any = queue.shift();
      const player2: any = queue.shift();
      // console.log({player1})
      console.log(player1.user);
      const msg = {
        action: 'match',
        player1: {
          name: player1.nickname,
          profile_picture: player1.user.avatar,
        },
        player2: {
          name: player2.nickname,
          profile_picture: player2.user.avatar,
        },
      };
      this.websocket.send(player1, 'matchmaking', msg);
      this.websocket.send(player2, 'matchmaking', msg);
      // this._delete_user_invitations(player1.user.id);
      // this._delete_user_invitations(player2.user.id);
      const game = new Game(
        this.prisma,
        this.websocket,
        this.achievement,
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
    // this.websocket.registerOnClose(socket, () => {
    this.cancel_queue(socket);
    this.leave_game(socket);
    // });
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
  // match_create(user: User){
  //     if (this.user.length == 0){
  //         this.user[0] = user;
  //         return "Waiting screen"; // TODO NEED TO ADD A CANCEL BUTTON
  //     }
  //     // console.log(this.user[0]);
  // }
}
