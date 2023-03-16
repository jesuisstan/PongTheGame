import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { AchievementService } from 'src/achievement/achievement.service';

export enum Status {
  STARTING = 'starting',
  PLAYING = 'playing',
  ENDED = 'ended',
  ABORTED = 'aborted',
}

export interface Position {
  x: number;
  y: number;
}

export interface KeyEvent {
  action: 'release' | 'press';
  direction: 'up' | 'down';
}

export interface Profile {
  socket: Socket;
  user: User;
}

export interface Player {
  profile: Profile;
  paddle: Position;
  score: number;
  event: 'up' | 'down' | null;
}

export interface Ball {
  position: Position;
  direction: Position;
  velocity: number;
  collidable: boolean;
  portalUsable: boolean;
}

export interface GameInfos {
  width: number;
  height: number;
  paddleHeight: number;
  paddleWidth: number;
  ballRadius: number;
}

export interface GameState {
  gameInfos: GameInfos;
  player1: Player;
  player2: Player;
  ball: Ball;
}

export const Default_params = {
  GAME_WIDTH: 1600,
  GAME_HEIGHT: 900,
  PADDLE_MOVE_SPEED: 10,
  PADDLE_OFFSET: 50,
  PADDLE_BORDER: 2,
  PADDLE_HEIGHT: 120,
  PADDLE_WIDTH: 10,
  BALL_RADIUS: 15,
  BALL_DEFAULT_SPEED: 10,
  BALL_SPEED_INCREASE: 0.6,
  BALL_MAX_SPEED: 18,
  BALL_PERTURBATOR: 0.2,
  GAME_TIME: 300,
};

export function get_default_game_state(
  player1: Profile,
  player2: Profile,
): GameState {
  const res = {
    gameInfos: {
      width: Default_params.GAME_WIDTH,
      height: Default_params.GAME_HEIGHT,
      paddleHeight: Default_params.PADDLE_HEIGHT,
      paddleWidth: Default_params.PADDLE_WIDTH,
      ballRadius: Default_params.BALL_RADIUS,
    },
    player1: {
      profile: player1,
      paddle: {
        x: Default_params.PADDLE_OFFSET,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    player2: {
      profile: player2,
      paddle: {
        x:
          Default_params.GAME_WIDTH -
          Default_params.PADDLE_OFFSET -
          Default_params.PADDLE_WIDTH,
        y: Default_params.GAME_HEIGHT / 2 - Default_params.PADDLE_HEIGHT / 2,
      },
      score: 0,
      event: null,
    },
    ball: {
      position: {
        x: Default_params.GAME_WIDTH / 2,
        y: Default_params.GAME_HEIGHT / 2,
      },
      direction: {
        x: 0,
        y: 0,
      },
      collidable: true,
      velocity: Default_params.BALL_DEFAULT_SPEED,
      portalUsable: true,
    },
    portals: [],
  };
  return res;
}

export function convert_state_to_sendable(
  state: GameState,
  timeInSeconds: number,
) {
  const res = {
    gameInfos: {
      originalWidth: state.gameInfos.width,
      originalHeight: state.gameInfos.height,
      paddleWidth: state.gameInfos.paddleWidth,
      paddleHeight: state.gameInfos.paddleHeight,
      ballRadius: state.gameInfos.ballRadius,
      time: Default_params.GAME_TIME - timeInSeconds,
    },
    player1: {
      paddle: {
        x: state.player1.paddle.x,
        y: state.player1.paddle.y,
      },
      score: state.player1.score,
      current: false,
    },
    player2: {
      paddle: {
        x: state.player2.paddle.x,
        y: state.player2.paddle.y,
      },
      score: state.player2.score,
      current: false,
    },
    ball: {
      x: state.ball.position.x,
      y: state.ball.position.y,
    },
  };
  return res;
}

export class Game {
  private websockets: WebsocketsService;
  private prisma: PrismaService;
  private achievements: AchievementService;
  private player1: Profile;
  private player2: Profile;
  private status: Status = Status.STARTING;
  private spectator_sockets: any[] = [];
  private start_counter = 10;
  private game_start_time: Date;
  private invitation?;
  private game_state: GameState;
  private end: () => void;

  constructor(
    private readonly prismaService: PrismaService,
    websockets: WebsocketsService,
    achievements: AchievementService,
    player1: Profile,
    player2: Profile,
    invitation?: any,
  ) {
    this.prisma = prismaService;
    this.websockets = websockets;
    this.achievements = achievements;
    this.player1 = player1;
    this.player2 = player2;
    this.game_state = get_default_game_state(player1, player2);
    this._reset_ball(this.game_state.ball);
    this.invitation = invitation;
  }

  async start(onEnd: () => void) {
    this.end = onEnd;
    while (this.start_counter > 0) {
      await this._wait(1000);
      this.start_counter--;
      this._send_to_players('match-starting', { time: this.start_counter });
    }
    this._send_to_players('match-starting', { time: this.start_counter });
    this.status = Status.PLAYING;
    this._set_players_status('PLAYING');
    this.game_start_time = new Date();
    // if (this.invitation) { // TODO add for the invit
    // this.websockets.sendToAllUsers(
    // 	this.invitation.message.channel.participants.map(
    // 		(p : any) => p.userId,
    // 	),
    // 	'chat-edit',
    // 	{
    // 		// type: 'invitation',
    // 		createdBy: this.invitation.createdBy.name,
    // 		channel: this.invitation.message.channelId,
    // 		// result: MathInvitationStatus.PLAYING,
    // 	},
    // );
    // await this.prisma.matchInvitation.update({
    // 	where: {
    // 		id: this.invitation.id,
    // 	},
    // 	data: {
    // 		status: MathInvitationStatus.PLAYING,
    // 	},
    // });
    // }
    this._game();
  }

  private async _game() {
    while (this.status === Status.PLAYING) {
      await this._wait(20);
      const now = new Date();
      const timePlayed = now.getTime() - this.game_start_time.getTime();
      const timeInSeconds = Math.floor(timePlayed / 1000);
      this._update_state();
      this._send_state_to_players(timeInSeconds);
      this._send_state_to_spectators(timeInSeconds);
      if (timeInSeconds >= Default_params.GAME_TIME) {
        if (this.game_state.player1.score != this.game_state.player2.score)
          this.status = Status.ENDED;
      }
    }
    if (this.status === Status.ABORTED) {
      this.end();
      return;
    }
    this._result();
  }

  private _result() {
    const now = new Date();
    const timePlayed = now.getTime() - this.game_start_time.getTime();
    const timeInSeconds = Math.floor(timePlayed / 1000);
    const winner =
      this.game_state.player1.score > this.game_state.player2.score
        ? this.game_state.player1
        : this.game_state.player2;
    const loser =
      winner == this.game_state.player1
        ? this.game_state.player2
        : this.game_state.player1;
    this._register_game(winner, loser, timeInSeconds);
    const res = {
      winner: {
        id: winner.profile.user.id,
        name: winner.profile.user.username,
        profile_picture: winner.profile.user.avatar,
        score: winner.score,
        position:
          winner.profile.user.id === this.game_state.player1.profile.user.id
            ? 1
            : 2,
      },
      loser: {
        id: loser.profile.user.id,
        name: loser.profile.user.username,
        profile_picture: loser.profile.user.avatar,
        score: loser.score,
        position:
          loser.profile.user.id === this.game_state.player1.profile.user.id
            ? 1
            : 2,
      },
      duration: timeInSeconds,
    };
    this._send_to_players('game-result', res);
    this.websockets.sendToAll(this.spectator_sockets, 'game-result', res);
    this.end();
  }

  // TODO add this fonction

  private async _register_game(
    winner: Player,
    loser: Player,
    timeInSeconds: number,
  ) {
    timeInSeconds;
    // const winnerXP = 50;
    // const loserXP = 0;
    // let eloChange = 0;
    // if (this._type === GameType.RANKED) {
    // 	let eloDiff = Math.abs(
    // 		winner.profile.user.profile.elo -
    // 			loser.profile.user.profile.elo,
    // 	);
    // 	if (eloDiff > 1000) eloDiff = 1000;
    // 	eloDiff /= 400;
    // 	eloDiff = Math.pow(10, eloDiff) + 1;
    // 	let score = 1 / eloDiff;
    // 	score = Math.round((1 - score) * 20);
    // 	eloChange = score;
    // }

    const user1 = this.player1.user;
    const is_user1_winner = user1.id === winner.profile.user.id;
    const user2 = this.player2.user;
    const is_user2_winner = user2.id === winner.profile.user.id;

    // MEMO TEST THIS
    console.log({ winner });
    console.log({ loser });
    console.log({ is_user1_winner });
    console.log({ is_user2_winner });
    this._set_players_status('ONLINE');

    // await this.prisma.match.create({
    //   data: {
    //     state: 'Finished',
    //     startDate: this.game_start_time.toString(),
    //     endDate: new Date().toString(),
    //     entries: [
    //       {
    //         userId: this.player1.user.id,
    //       },
    //       {
    //         userId: this.player2.user.id,
    //       },
    //     ],
    //   },
    // });
    // promises.push(
    // 	this._prismaService.user.update({
    // 		where: { id: winner.profile.user.id },
    // 		data: {
    // 			profile: {
    // 				update: {
    // 					xp: {
    // 						increment: winnerXP,
    // 					},
    // 					elo: {
    // 						increment: eloChange,
    // 					},
    // 					wonMatches: {
    // 						increment: 1,
    // 					},
    // 				},
    // 			},
    // 		},
    // 	}),
    // );
    // promises.push(
    // 	this._prismaService.user.update({
    // 		where: { id: loser.profile.user.id },
    // 		data: {
    // 			profile: {
    // 				update: {
    // 					xp: {
    // 						increment: loserXP,
    // 					},
    // 					elo: {
    // 						increment: -eloChange,
    // 					},
    // 					lostMatches: {
    // 						increment: 1,
    // 					},
    // 				},
    // 			},
    // 		},
    // 	}),
    // );
    // this._achievementsService.progressAchievements(
    // 	winner.profile.user.profile.id,
    // 	[
    // 		AchievementType.NEW_SUBJECT,
    // 		AchievementType.WHEATLEY,
    // 		AchievementType.P_BODY,
    // 		AchievementType.GLADOS,
    // 		AchievementType.APPRENTICE,
    // 		AchievementType.LEARNER,
    // 		AchievementType.EXPERT,
    // 		AchievementType.STREAKER,
    // 		AchievementType.MASTER_STREAKER,
    // 	],
    // 	1,
    // );
    // this._achievementsService.progressAchievements(
    // 	loser.profile.user.profile.id,
    // 	[
    // 		AchievementType.WHEATLEY,
    // 		AchievementType.P_BODY,
    // 		AchievementType.GLADOS,
    // 	],
    // 	1,
    // );
    // this._achievementsService.setAchievements(
    // 	loser.profile.user.profile.id,
    // 	[AchievementType.STREAKER, AchievementType.MASTER_STREAKER],
    // 	0,
    // );
    // this._achievementsService.progressAchievements(
    // 	user1.profile.id,
    // 	[AchievementType.BOUNCER, AchievementType.PROFFESIONAL_BOUNCER],
    // 	this._bounceP1,
    // );
    // this._achievementsService.progressAchievements(
    // 	user2.profile.id,
    // 	[AchievementType.BOUNCER, AchievementType.PROFFESIONAL_BOUNCER],
    // 	this._bounceP2,
    // );
    // this._achievementsService.progressAchievements(
    // 	user1.profile.id,
    // 	[AchievementType.PORTALS_USER, AchievementType.PORTALS_ADDICT],
    // 	this._portalsUsedP1,
    // );
    // this._achievementsService.progressAchievements(
    // 	user2.profile.id,
    // 	[AchievementType.PORTALS_USER, AchievementType.PORTALS_ADDICT],
    // 	this._portalsUsedP2,
    // );
    // this._achievementsService.setAchievements(
    // 	winner.profile.user.profile.id,
    // 	[
    // 		AchievementType.CHAMPION,
    // 		AchievementType.MASTER,
    // 		AchievementType.LEGEND,
    // 	],
    // 	winner.profile.user.profile.elo + eloChange,
    // );
    // this._achievementsService.setAchievements(
    // 	loser.profile.user.profile.id,
    // 	[
    // 		AchievementType.CHAMPION,
    // 		AchievementType.MASTER,
    // 		AchievementType.LEGEND,
    // 	],
    // 	winner.profile.user.profile.elo - eloChange,
    // );
    // if (timeInSeconds > GameParams.GAME_TIME) {
    // 	this._achievementsService.setAchievement(
    // 		winner.profile.user.profile.id,
    // 		AchievementType.ENDURANT,
    // 		1,
    // 	);
    // 	this._achievementsService.setAchievement(
    // 		loser.profile.user.profile.id,
    // 		AchievementType.ENDURANT,
    // 		1,
    // 	);
    // }
    // if (timeInSeconds > 10 * 60) {
    // 	this._achievementsService.setAchievement(
    // 		winner.profile.user.profile.id,
    // 		AchievementType.SEMI_MARATHON,
    // 		1,
    // 	);
    // 	this._achievementsService.setAchievement(
    // 		loser.profile.user.profile.id,
    // 		AchievementType.SEMI_MARATHON,
    // 		1,
    // 	);
    // }
    // if (timeInSeconds > 20 * 60) {
    // 	this._achievementsService.setAchievement(
    // 		winner.profile.user.profile.id,
    // 		AchievementType.MARATHON,
    // 		1,
    // 	);
    // 	this._achievementsService.setAchievement(
    // 		loser.profile.user.profile.id,
    // 		AchievementType.MARATHON,
    // 		1,
    // 	);
    // }

    // if (this.invitation) {
    // 	this._websocketsService.sendToAllUsers(
    // 		this.invitation.message.channel.participants.map(
    // 			(p) => p.userId,
    // 		),
    // 		'chat-delete',
    // 		{
    // 			type: 'invitation',
    // 			createdBy: this.invitation.createdBy.name,
    // 			channel: this.invitation.message.channel.id,
    // 		},
    // 	);
    // 	promises.push(
    // 		this._prismaService.matchInvitation.deleteMany({
    // 			where: { id: this.invitation.id },
    // 		}),
    // 	);
    // 	promises.push(
    // 		this._prismaService.messageOnChannel.deleteMany({
    // 			where: { id: this.invitation.message.id },
    // 		}),
    // 	);
    // }
    // await Promise.all(promises);
  }

  get_players() {
    return [this.player1.user, this.player2.user];
  }

  get_player(userId: number): Player | null {
    if (!this.player1 || !this.player2) return null;
    if (this.player1.user.id === userId) {
      return this.game_state.player1;
    } else if (this.player2.user.id === userId) {
      return this.game_state.player2;
    } else {
      return null;
    }
  }

  async leave(userId: number) {
    const leaved = this.get_player(userId);
    if (!leaved) return;
    const otherPlayer =
      this.game_state.player1.profile.user.id === leaved.profile.user.id
        ? this.game_state.player2
        : this.game_state.player1;
    this.websockets.send(leaved.profile.socket, 'game-aborted', {
      reason: 'player-left',
      result: 'lose',
    });
    this.websockets.send(otherPlayer.profile.socket, 'game-aborted', {
      reason: 'player-left',
      result: 'win',
    });
    this.status = Status.ABORTED;
    if (this.game_start_time) {
      const now = new Date();
      const timePlayed = now.getTime() - this.game_start_time.getTime();
      const timeInSeconds = Math.floor(timePlayed / 1000);
      this._register_game(otherPlayer, leaved, timeInSeconds);
    }
    this._set_players_status('ONLINE');
    this.end();
  }

  process_input(userId: number, data: KeyEvent) {
    const player = this.get_player(userId);
    if (!player) return;
    if (data.action === 'press') {
      player.event = data.direction;
    }
    if (data.action === 'release') {
      player.event = null;
    }
  }

  add_spectator(socket: any) {
    this.spectator_sockets.push(socket);
  }

  remove_spectator(socket: any) {
    this.spectator_sockets = this.spectator_sockets.filter((s) => s !== socket);
  }

  get_spectator(userId: number): Player | null {
    return this.spectator_sockets.find((s) => s['user'].id === userId);
  }

  private _update_state() {
    this._update_player(this.game_state.player1);
    this._update_player(this.game_state.player2);
    this._update_ball(this.game_state.ball);
  }

  private _update_ball(ball: Ball) {
    const norm = Math.sqrt(
      ball.direction.x * ball.direction.x + ball.direction.y * ball.direction.y,
    );
    if (norm === 0) return;
    ball.direction.x /= norm;
    ball.direction.y /= norm;
    const ballRadius: number = this.game_state.gameInfos.ballRadius;
    ball.position.x += ball.direction.x * ball.velocity;
    ball.position.y += ball.direction.y * ball.velocity;
    this._check_ball_collide_wall(ball, ballRadius);
    this._check_ball_collide_paddle(
      ball,
      ballRadius,
      this.game_state.player1.paddle,
      this.game_state.gameInfos.paddleWidth,
      this.game_state.gameInfos.paddleHeight,
    );
    this._check_ball_collide_paddle(
      ball,
      ballRadius,
      this.game_state.player2.paddle,
      this.game_state.gameInfos.paddleWidth,
      this.game_state.gameInfos.paddleHeight,
    );
  }

  get_player_by_name(name: string): Player | null {
    if (!this.player1 || !this.player2) return null;
    if (this.player1.user.username === name) {
      return this.game_state.player1;
    } else if (this.player2.user.username === name) {
      return this.game_state.player2;
    } else {
      return null;
    }
  }

  private _check_ball_collide_paddle(
    ball: Ball,
    ballRadius: number,
    paddle: Position,
    paddleWidth: number,
    paddleHeight: number,
  ) {
    if (ball.collidable) {
      const ballColide: any = {
        x: ball.position.x - ballRadius,
        y: ball.position.y - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2,
      };
      const paddleFrontUpCollideZone: any = {
        x: paddle.x,
        y: paddle.y,
        width: 2,
        height: paddleHeight / 3,
      };
      const paddleFrontMiddleCollideZone: any = {
        x: paddle.x,
        y: paddle.y + paddleHeight / 3,
        width: 2,
        height: paddleHeight / 3,
      };
      const paddleFrontDownCollideZone: any = {
        x: paddle.x,
        y: paddle.y + (paddleHeight / 3) * 2,
        width: 2,
        height: paddleHeight / 3,
      };
      const paddleTopCollideZone: any = {
        x: paddle.x,
        y: paddle.y - 2,
        width: paddleWidth,
        height: 2,
      };
      const paddleBottomCollideZone: any = {
        x: paddle.x,
        y: paddle.y + paddleHeight + 2,
        width: paddleWidth,
        height: 2,
      };
      let res = false;
      if (this._check_colide(ballColide, paddleFrontUpCollideZone)) {
        ball.direction.x *= -1;
        ball.direction.y -= Default_params.BALL_PERTURBATOR;
        ball.velocity += Default_params.BALL_SPEED_INCREASE;
        this._disable_collision(ball);
        res = true;
      } else if (this._check_colide(ballColide, paddleFrontMiddleCollideZone)) {
        ball.direction.x *= -1;
        ball.velocity += Default_params.BALL_SPEED_INCREASE;
        this._disable_collision(ball);
        res = true;
      } else if (this._check_colide(ballColide, paddleFrontDownCollideZone)) {
        ball.direction.x *= -1;
        ball.direction.y += Default_params.BALL_PERTURBATOR;
        ball.velocity += Default_params.BALL_SPEED_INCREASE;
        this._disable_collision(ball);
        res = true;
      } else if (this._check_colide(ballColide, paddleTopCollideZone)) {
        ball.direction.x *= -1;
        ball.direction.y *= -1;
        this._disable_collision(ball);
        res = true;
      } else if (this._check_colide(ballColide, paddleBottomCollideZone)) {
        ball.direction.x *= -1;
        ball.direction.y *= -1;
        this._disable_collision(ball);
        res = true;
      }
      if (ball.velocity > Default_params.BALL_MAX_SPEED) {
        ball.velocity = Default_params.BALL_MAX_SPEED;
      }
      return res;
    }
  }

  private async _disable_collision(ball: Ball) {
    ball.collidable = false;
    await this._wait(200);
    ball.collidable = true;
  }

  private _send_state_to_spectators(timeInSeconds: number) {
    const res = convert_state_to_sendable(this.game_state, timeInSeconds);
    this.websockets.sendToAll(this.spectator_sockets, 'game-state', res);
  }

  private _check_colide(collide1: any, collide2: any) {
    return (
      collide1.x < collide2.x + collide2.width &&
      collide1.x + collide1.width > collide2.x &&
      collide1.y < collide2.y + collide2.height &&
      collide1.y + collide1.height > collide2.y
    );
  }

  private _check_ball_collide_wall(ball: Ball, ballRadius: number) {
    if (ball.position.x < ballRadius) {
      this.game_state.player2.score++;
      this._reset_ball(ball);
    }
    if (ball.position.x > this.game_state.gameInfos.width - ballRadius) {
      this.game_state.player1.score++;
      this._reset_ball(ball);
    }
    if (ball.position.y < ballRadius) {
      ball.position.y = ballRadius;
      ball.direction.y *= -1;
    }
    if (ball.position.y > this.game_state.gameInfos.height - ballRadius) {
      ball.position.y = this.game_state.gameInfos.height - ballRadius;
      ball.direction.y *= -1;
    }
  }

  private _update_player(player: Player) {
    if (player.event == null) return;
    if (player.event === 'up') {
      player.paddle.y -= Default_params.PADDLE_MOVE_SPEED;
      if (player.paddle.y < Default_params.PADDLE_BORDER)
        player.paddle.y = Default_params.PADDLE_BORDER;
    }
    if (player.event === 'down') {
      player.paddle.y += Default_params.PADDLE_MOVE_SPEED;
      if (
        player.paddle.y >
        this.game_state.gameInfos.height -
          this.game_state.gameInfos.paddleHeight -
          Default_params.PADDLE_BORDER
      )
        player.paddle.y =
          this.game_state.gameInfos.height -
          this.game_state.gameInfos.paddleHeight -
          Default_params.PADDLE_BORDER;
    }
  }

  async _set_players_status(status: 'ONLINE' | 'PLAYING') {
    await this.prisma.user.updateMany({
      where: {
        OR: [{ id: this.player1.user.id }, { id: this.player2.user.id }],
      },
      data: { status: status },
    });
    this.websockets.broadcast('user-status', {
      id: this.player1.user.id,
      status: status,
    });
    this.websockets.broadcast('user-status', {
      id: this.player2.user.id,
      status: status,
    });
  }

  private async _wait(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private _send_state_to_players(timeInSeconds: number) {
    const res = convert_state_to_sendable(this.game_state, timeInSeconds);
    res.player1.current = true;
    this.websockets.send(this.player1.socket, 'game-state', res);
    res.player1.current = false;
    res.player2.current = true;
    this.websockets.send(this.player2.socket, 'game-state', res);
  }

  private _send_to_players(event: string, data: any) {
    this.websockets.send(this.player1.socket, event, data);
    this.websockets.send(this.player2.socket, event, data);
  }

  private _reset_ball(ball: Ball) {
    ball.position.x = this.game_state.gameInfos.width / 2;
    ball.position.y = this.game_state.gameInfos.height / 2;
    ball.direction.y =
      (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? -1 : 1);
    ball.direction.x =
      Math.sqrt(1 - ball.direction.y * ball.direction.y) *
      (Math.random() < 0.5 ? -1 : 1);
    ball.velocity = Default_params.BALL_DEFAULT_SPEED;
  }
}
