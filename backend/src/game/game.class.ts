import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import {
  Ball,
  GameState,
  InvitationState,
  KeyEvent,
  Player,
  Position,
  Profile,
  Status,
} from './Interface';

export const Default_params = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PADDLE_MOVE_SPEED: 10,
  PADDLE_OFFSET: 50,
  PADDLE_BORDER: 2,
  PADDLE_HEIGHT: 600 / 6,
  PADDLE_WIDTH: 20,
  BALL_RADIUS: 10,
  BALL_DEFAULT_SPEED: 10,
  BALL_SPEED_INCREASE: 0.6,
  BALL_MAX_SPEED: 10,
  BALL_PERTURBATOR: 0.2,
  GAME_TIME: 300, // TODO change for 300
  DEFAULT_PADDLE_POSITION: 600 / 2 - 300 / 6 / 2,
  WINING_SCORE: 5,
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
      winingScore: this.game_state.gameInfos.WinScore, // TODO Wining score
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
  };
  return res;
}

export function convert_state_to_sendable(
  state: GameState,
  status: Status,
  timeInSeconds: number,
) {
  const res = {
    status: status,
    gameInfos: {
      originalWidth: state.gameInfos.width,
      originalHeight: state.gameInfos.height,
      paddleWidth: state.gameInfos.paddleWidth,
      paddleHeight: state.gameInfos.paddleHeight,
      ballRadius: state.gameInfos.ballRadius,
      time: Default_params.GAME_TIME - timeInSeconds,
      WinScore: state.gameInfos.WinScore,
    },
    player1: {
      paddle: {
        x: state.player1.paddle.x,
        y: state.player1.paddle.y,
      },
      infos: {
        name: state.player1.profile.user.nickname,
        profile_picture: state.player1.profile.user.avatar,
      },
      score: state.player1.score,
      current: false,
    },
    player2: {
      paddle: {
        x: state.player2.paddle.x,
        y: state.player2.paddle.y,
      },
      infos: {
        name: state.player2.profile.user.nickname,
        profile_picture: state.player2.profile.user.avatar,
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
  private achievements: giveAchievementService;
  private player1: Profile;
  private player2: Profile;
  private status: Status = Status.STARTING;
  private spectator_sockets: any[] = [];
  private start_counter = 5;
  private game_start_time: Date;
  private invitation?;
  private id_game: number;
  private game_state: GameState;
  private end: () => void;

  constructor(
    prismaService: PrismaService,
    websockets: WebsocketsService,
    achievements: giveAchievementService,
    player1: Profile,
    player2: Profile,
    invitation?: any,
    winningScore?: number,
  ) {
    this.prisma = prismaService;
    this.websockets = websockets;
    this.achievements = achievements;
    this.player1 = player1;
    this.player2 = player2;
    this.game_state = get_default_game_state(player1, player2);
    this._reset_ball(this.game_state.ball);
    this.invitation = invitation;
    this.game_state.gameInfos.WinScore = winningScore; // TODO add winningscore
  }

  async start(onEnd: () => void) {
    this.end = onEnd;
    while (this.start_counter > 0) {
      await this._wait(1000);
      this.start_counter--;
      this._send_to_players('match_starting', { time: this.start_counter });
    }
    this._send_to_players('match_starting', { time: this.start_counter });
    this.status = Status.PLAYING;
    this._set_players_status('PLAYING');
    this.game_start_time = new Date();

    if (this.invitation) {
      // await this.prisma.matchInvitation.update({ // TODO update the status
      //   where: {
      //     id: this.invitation.id,
      //   },
      //   data: {
      //     status: InvitationState.PLAYING,
      //   },
      // });
    }
    this.id_game = (
      await this.prisma.match.create({
        data: {
          state: 'Started',
          startDate: this.game_start_time.toISOString(),
          endDate: new Date().toISOString(),
          entries: {
            create: [
              {
                userId: this.player1.user.id,
                score: 0,
              },
              {
                userId: this.player2.user.id,
                score: 0,
              },
            ],
          },
        },
      })
    ).id;
    this._game();
  }

  private _result_string(winner : Player, loser : Player){
    const res = { winner: {
      id: winner.profile.user.id,
      name: winner.profile.user.nickname,
      profile_picture: winner.profile.user.avatar,
      score: winner.score,
    },
    loser: {
      id: loser.profile.user.id,
      name: loser.profile.user.nickname,
      profile_picture:  loser.profile.user.avatar,
      score: loser.score,
    }}
    return res;
  }

  private async _game() {
    while (this.status === Status.PLAYING) {
      await this._wait(45);
      const now = new Date();
      const timePlayed = now.getTime() - this.game_start_time.getTime();
      const timeInSeconds = Math.floor(timePlayed / 1000);
      this._update_state();
      this._send_state_to_players(timeInSeconds);
      this._send_state_to_spectators(timeInSeconds);
      if (
        this.game_state.player1.score == Default_params.WINING_SCORE ||
        this.game_state.player2.score == Default_params.WINING_SCORE
      ) {
        this.status = Status.ENDED;
        this._send_state_to_players(timeInSeconds);
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
    this.end();
  }

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

    this._set_players_status('ONLINE');
    const res = this._result_string(winner, loser);
    this.websockets.send(this.player1.socket, "match_result", res);
    this.websockets.send(this.player2.socket, "match_result", res);
    await this.prisma.match.update({
      where: { id: this.id_game },
      data: {
        state: 'Finished',
        endDate: new Date().toISOString(),
        entries: {
          create: [
            {
              userId: winner.profile.user.id,
              score: winner.score,
            },
            {
              userId: loser.profile.user.id,
              score: loser.score,
            },
          ],
        },
      },
    });
    await this.prisma.stats.update({
      where: {
        userId: winner.profile.user.id,
      },
      data: {
        nb_win: { increment: 1 },
        nb_game: { increment: 1 },
      },
    });

    await this.prisma.stats.update({
      where: {
        userId: loser.profile.user.id,
      },
      data: {
        nb_game: { increment: 1 },
      },
    });
    await this.achievements.getAchievement(this.player1.user);
    await this.achievements.getAchievement(this.player2.user);
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
    this.websockets.send(leaved.profile.socket, 'game_aborted', {
      reason: 'player_left',
      result: 'lose',
    });
    this.websockets.send(otherPlayer.profile.socket, 'game_aborted', {
      reason: 'player_left',
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
    const res = convert_state_to_sendable(
      this.game_state,
      this.status,
      timeInSeconds,
    );
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
    this.websockets.broadcast('user_status', {
      id: this.player1.user.id,
      status: status,
    });
    this.websockets.broadcast('user_status', {
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
    const res = convert_state_to_sendable(
      this.game_state,
      this.status,
      timeInSeconds,
    );
    res.player1.current = true;
    this.websockets.send(this.player1.socket, 'match_game_state', res);
    res.player1.current = false;
    res.player2.current = true;
    this.websockets.send(this.player2.socket, 'match_game_state', res);
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
