import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import {
  Ball,
  GameState,
  KeyEvent,
  Obstacle,
  Player,
  Position,
  Profile,
  Status,
  TypeMode,
} from './Interface';
import { User } from '@prisma/client';
import {
  convert_state_to_sendable,
  get_default_game_state,
} from './create_state';

export const Default_params = {
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PADDLE_MOVE_SPEED: 2,
  PADDLE_OFFSET: 20,
  PADDLE_BORDER: 1,
  PADDLE_HEIGHT: 600 / 6,
  PADDLE_WIDTH: 5,
  BALL_RADIUS: 10,
  BALL_DEFAULT_SPEED: 2,
  BALL_SPEED_INCREASE: 0.3,
  BALL_MAX_SPEED: 3.5,
  BALL_PERTURBATOR: 0.2,
  DEFAULT_PADDLE_POSITION: 600 / 2 - 300 / 6 / 2,
  OBSTACLE_HEIGHT: 150,
  OBSTACLE_WIDTH: 10,
  OBSTACLE_SPEED: 1.5,
};

export class Game {
  private websockets: WebsocketsService;
  private prisma: PrismaService;
  private achievements: giveAchievementService;
  private player1: Profile;
  private player2?: Profile;
  private status: Status = Status.STARTING;
  private spectator_sockets: any[] = [];
  private start_counter = 5;
  private game_start_time: Date;
  private type: TypeMode;
  private id_game: number;
  private game_state: GameState;
  private obstacle?: boolean;
  private people_left: Player;
  private end: () => void;

  constructor(
    prismaService: PrismaService,
    websockets: WebsocketsService,
    achievements: giveAchievementService,
    type: TypeMode,
    winScore: number,
    player1: Profile,
    player2?: Profile,
    obstacle?: boolean,
  ) {
    this.prisma = prismaService;
    this.websockets = websockets;
    this.achievements = achievements;
    this.player1 = player1;
    this.player2 = player2;
    this.game_state = get_default_game_state(type, winScore, player1, player2);
    this.type = type;
    this._reset_ball(this.game_state.ball);
    this.obstacle = obstacle;
    this.game_state.gameInfos.winScore = winScore;
  }

  async start(onEnd: () => void) {
    this.end = onEnd;

    this.game_start_time = new Date();
    if (this.type != TypeMode.TRAINING) {
      const tmp_player: (Profile | undefined)[] = [this.player1, this.player2];
      if (!tmp_player[0] || !tmp_player[1]) return;
      this.id_game = (
        await this.prisma.match.create({
          data: {
            state: 'Started',
            startDate: this.game_start_time.toISOString(),
            endDate: new Date().toISOString(),
            entries: {
              create: [
                {
                  userId: tmp_player[0].user.id,
                  score: 0,
                },
                {
                  userId: tmp_player[1].user.id,
                  score: 0,
                },
              ],
            },
          },
        })
      ).id;
    } else {
      const AI = await this.prisma.user.findUnique({
        where: {
          id: 1,
        },
      });
      if (!AI) return;
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
                  userId: AI.id,
                  score: 0,
                },
              ],
            },
          },
        })
      ).id;
    }

    while (this.start_counter > 0 && this.status == Status.STARTING) {
      this._set_players_status('PREPARING');
      await this._wait(1000);
      this.start_counter--;
      this._send_to_players('match_starting', { time: this.start_counter });
      if (this.people_left) {
        this.status = Status.ABORTED;
        break;
      }
    }
    if (this.status == Status.ABORTED) {
      this.websockets.send(this.player1.socket, 'match_abort_during_begin', {});
      this.websockets.send(
        this.player2?.socket,
        'match_abort_during_begin',
        {},
      );
      this.end();
      return;
    }
    this._send_to_players('match_starting', { time: this.start_counter });
    this.status = Status.PLAYING;
    this._set_players_status('PLAYING');

    this._game();
  }

  obstacleRun(obstacle?: Obstacle | undefined) {
    if (!obstacle) return;
    if (obstacle.direction > 0) {
      // Go up or down
      if (
        obstacle.position.y <
        Default_params.GAME_HEIGHT - Default_params.OBSTACLE_HEIGHT
      ) {
        obstacle.position.y += Default_params.OBSTACLE_SPEED; // go down
      } else {
        obstacle.position.y -= Default_params.OBSTACLE_SPEED; // Go up
        obstacle.direction *= -1;
      }
    } else {
      if (obstacle.position.y > 0) {
        obstacle.position.y -= Default_params.OBSTACLE_SPEED; // go up
      } else {
        obstacle.position.y += Default_params.OBSTACLE_SPEED; // go down
        obstacle.direction *= -1;
      }
    }
  }

  private _result_string(winner: Player, loser: Player, reason: string) {
    const res = {
      winner: {
        id: winner.profile?.user.id,
        name: winner.profile?.user.nickname,
        avatar: winner.profile?.user.avatar,
        score: winner.score,
      },
      loser: {
        id: loser.profile?.user.id,
        name: loser.profile?.user.nickname,
        avatar: loser.profile?.user.avatar,
        score: loser.score,
      },
      reason: reason,
    };
    return res;
  }

  private _computerAI() {
    const paddle2YCenter =
      this.game_state.player2.paddle.y + Default_params.PADDLE_HEIGHT / 2;
    const distanceToBall = Math.abs(
      paddle2YCenter - this.game_state.ball.position.y,
    );
    const speedMultiplier =
      1 - distanceToBall / (Default_params.GAME_HEIGHT / 2);

    const targetY =
      this.game_state.ball.position.y - Default_params.PADDLE_HEIGHT / 2;
    const dy = targetY - paddle2YCenter;
    let paddleSpeed = dy * speedMultiplier;

    // Limit paddle speed to a maximum of 4
    paddleSpeed = Math.min(paddleSpeed, Default_params.PADDLE_MOVE_SPEED);

    this.game_state.player2.paddle.y += paddleSpeed;

    // Make sure paddle stays within bounds of the canvas
    if (this.game_state.player2.paddle.y < 0) {
      this.game_state.player2.paddle.y = 0;
    } else if (
      this.game_state.player2.paddle.y >
      Default_params.GAME_HEIGHT - Default_params.PADDLE_HEIGHT
    ) {
      this.game_state.player2.paddle.y =
        Default_params.GAME_HEIGHT - Default_params.PADDLE_HEIGHT;
    }
  }

  private async _game() {
    while (this.status === Status.PLAYING) {
      await this._wait(5);
      const now = new Date();
      const timePlayed = now.getTime() - this.game_start_time.getTime();
      const timeInSeconds = Math.floor(timePlayed / 1000);
      this._update_state();
      this._send_state_to_players(timeInSeconds);
      this._send_state_to_spectators(timeInSeconds);
      if (
        (this.game_state.player1.score == this.game_state.gameInfos.winScore ||
          this.game_state.player2.score ==
            this.game_state.gameInfos.winScore) &&
        !this.people_left
      ) {
        this.status = Status.ENDED;
        this._send_state_to_players(timeInSeconds);
        this._send_state_to_spectators(timeInSeconds);
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
    this._register_game(winner, loser, timeInSeconds, 'Game Finished');
    this.end();
  }

  private async _register_game(
    winner: Player,
    loser: Player,
    timeInSeconds: number,
    reason: string,
  ) {
    timeInSeconds;
    let profile_winner: User | undefined;
    let profile_loser: User | undefined;
    this._set_players_status('ONLINE');
    const res = this._result_string(winner, loser, reason);
    this.websockets.send(this.player1.socket, 'match_result', res);
    this.websockets.sendToAll(this.spectator_sockets, 'match_result', res);
    if (this.type != TypeMode.TRAINING) {
      this.websockets.send(this.player2?.socket, 'match_result', res);
      profile_winner = winner.profile?.user;
      profile_loser = loser.profile?.user;
    } else {
      const AI: User | null = await this.prisma.user.findUnique({
        where: {
          nickname: 'AI',
        },
      });
      if (!AI) return;
      if (winner.profile?.user == undefined) {
        profile_winner = AI;
        profile_loser = loser.profile?.user;
      } else {
        profile_loser = AI;
        profile_winner = loser.profile?.user;
      }
    }
    if (!profile_winner || !profile_loser) return;
    await this.prisma.match.update({
      where: { id: this.id_game },
      data: {
        state: 'Finished',
        endDate: new Date().toISOString(),
      },
    });
    if (this.type != TypeMode.TRAINING) {
      await this.prisma.stats.update({
        where: {
          userId: winner.profile?.user.id,
        },
        data: {
          nb_win: { increment: 1 },
          nb_game: { increment: 1 },
        },
      });
      await this.prisma.stats.update({
        where: {
          userId: loser.profile?.user.id,
        },
        data: {
          nb_game: { increment: 1 },
        },
      });
    }
    await this.achievements.getAchievement(this.player1.user);
    await this.achievements.getAchievement(this.player2?.user);
  }

  get_players() {
    return [this.player1.user, this.player2?.user];
  }

  get_player(userId: number): Player | null {
    if (this.player1 && this.player1.user.id === userId) {
      return this.game_state.player1;
    } else if (this.player2 && this.player2.user.id === userId) {
      return this.game_state.player2;
    } else {
      return null;
    }
  }

  async leave(userId: number) {
    const leaved = this.get_player(userId);
    if (!leaved) return;
    const otherPlayer =
      this.game_state.player1.profile?.user.id === leaved.profile?.user.id
        ? this.game_state.player2
        : this.game_state.player1;
    this.people_left = otherPlayer;
    this.people_left.score = this.game_state.gameInfos.winScore;
    leaved.score = 0;
    this.status = Status.ABORTED;
    const now = new Date();
    const timePlayed = now.getTime() - this.game_start_time.getTime();
    const timeInSeconds = Math.floor(timePlayed / 1000);
    this._register_game(
      otherPlayer,
      leaved,
      timeInSeconds,
      'Player left the game',
    );
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
    if (this.obstacle) this.obstacleRun(this.game_state.obstacle);
    this._update_player(this.game_state.player1);
    if (this.type != TypeMode.TRAINING)
      this._update_player(this.game_state.player2);
    else this._computerAI();
    this._update_ball(this.game_state.ball);
  }

  private _update_ball(ball: Ball) {
    const norm = Math.sqrt(
      ball.direction.x * ball.direction.x + ball.direction.y * ball.direction.y,
    );
    if (norm === 0) return;
    ball.direction.x /= norm;
    ball.direction.y /= norm;
    //ball.position.x += ball.direction.x * ball.velocity;
    // ball.position.x += Math.round((ball.direction.x * 10) / 10) * 10)
    ball.position.x += ball.direction.x * ball.velocity;
    ball.position.y += ball.direction.y * ball.velocity;

    this._check_ball_collide_wall(ball);
    this._check_ball_collide_paddle(
      ball,
      {
        x: this.game_state.player1.paddle.x - Default_params.PADDLE_WIDTH,
        y: this.game_state.player1.paddle.y,
      },
      this.game_state.gameInfos.paddleWidth,
      this.game_state.gameInfos.paddleHeight,
    );
    this._check_ball_collide_paddle(
      ball,
      {
        x: this.game_state.player2.paddle.x - Default_params.BALL_RADIUS,
        y: this.game_state.player2.paddle.y,
      },
      this.game_state.gameInfos.paddleWidth,
      this.game_state.gameInfos.paddleHeight,
    );
    if (this.obstacle) {
      if (!this.game_state.obstacle) return;
      this._check_ball_collide_paddle(
        ball,
        {
          x:
            this.game_state.obstacle.position.x - Default_params.OBSTACLE_WIDTH,
          y: this.game_state.obstacle.position.y,
        },
        Default_params.OBSTACLE_WIDTH,
        Default_params.OBSTACLE_HEIGHT,
      );
      this._check_ball_collide_paddle(
        ball,
        this.game_state.obstacle.position,
        Default_params.OBSTACLE_WIDTH,
        Default_params.OBSTACLE_HEIGHT,
      );
    }
  }

  get_player_by_name(name: string): Player | null | undefined {
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
    paddle: Position,
    paddleWidth: number,
    paddleHeight: number,
  ) {
    if (ball.collidable) {
      const ballColide: any = {
        x: ball.position.x - Default_params.BALL_RADIUS,
        y: ball.position.y,
        width: Default_params.BALL_RADIUS,
        height: Default_params.BALL_RADIUS,
      };
      const paddleFrontUpCollideZone: any = {
        x: paddle.x,
        y: paddle.y,
        width: Default_params.BALL_RADIUS,
        height: paddleHeight / 3,
      };
      const paddleFrontMiddleCollideZone: any = {
        x: paddle.x,
        y: paddle.y + paddleHeight / 3,
        width: Default_params.BALL_RADIUS,
        height: paddleHeight / 3,
      };
      const paddleFrontDownCollideZone: any = {
        x: paddle.x,
        y: paddle.y + (paddleHeight / 3) * 2,
        width: Default_params.BALL_RADIUS,
        height: paddleHeight / 3,
      };
      const paddleTopCollideZone: any = {
        x: paddle.x,
        y: paddle.y,
        width: paddleWidth,
        height: Default_params.BALL_RADIUS,
      };
      const paddleBottomCollideZone: any = {
        x: paddle.x,
        y: paddle.y + paddleHeight,
        width: paddleWidth,
        height: Default_params.BALL_RADIUS,
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
        ball.direction.y += Default_params.BALL_PERTURBATOR;
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
      this.type,
      this.game_state,
      this.status,
      timeInSeconds,
    );
    this.websockets.sendToAll(
      this.spectator_sockets,
      'match_spectate_state',
      res,
    );
  }

  private _check_colide(collide1: any, collide2: any) {
    return (
      collide1.x < collide2.x + collide2.width &&
      collide1.x + collide1.width > collide2.x &&
      collide1.y < collide2.y + collide2.height &&
      collide1.y + collide1.height > collide2.y
    );
  }

  private _check_ball_collide_wall(ball: Ball) {
    if (ball.position.x < Default_params.BALL_RADIUS) {
      this.game_state.player2.score++;
      this._reset_ball(ball);
      if (this.obstacle) this._reset_obstacle(this.game_state.obstacle);
    }
    if (
      ball.position.x >
      this.game_state.gameInfos.width - Default_params.BALL_RADIUS
    ) {
      this.game_state.player1.score++;
      this._reset_ball(ball);
      if (this.obstacle) this._reset_obstacle(this.game_state.obstacle);
    }
    if (ball.position.y < Default_params.BALL_RADIUS) {
      ball.position.y = Default_params.BALL_RADIUS;
      ball.direction.y *= -1;
    }
    if (
      ball.position.y >
      this.game_state.gameInfos.height - Default_params.BALL_RADIUS
    ) {
      ball.position.y =
        this.game_state.gameInfos.height - Default_params.BALL_RADIUS;
      ball.direction.y *= -1;
    }
  }

  private _reset_obstacle(Obstacle?: Obstacle) {
    if (!Obstacle) return;
    Obstacle.position.x =
      Default_params.GAME_WIDTH / 2 - Default_params.OBSTACLE_WIDTH / 2;
    Obstacle.position.y = 0;
    Obstacle.direction = 1;
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

  async _set_players_status(status: 'ONLINE' | 'PLAYING' | 'PREPARING') {
    await this.prisma.user.updateMany({
      where: {
        OR: [{ id: this.player1.user.id }, { id: this.player2?.user.id }],
      },
      data: { status: status },
    });
    this.websockets.broadcast('user_status', {
      nickname: this.player1.user.nickname,
      status: status,
    });
    if (this.type == TypeMode.NORMAL)
      this.websockets.broadcast('user_status', {
        nickname: this.player2?.user.nickname,
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
      this.type,
      this.game_state,
      this.status,
      timeInSeconds,
    );
    res.player1.current = true;
    this.websockets.send(this.player1.socket, 'match_game_state', res);
    res.player1.current = false;
    if (this.type != TypeMode.TRAINING) {
      res.player2.current = true;
      this.websockets.send(this.player2?.socket, 'match_game_state', res);
    }
  }

  private _send_to_players(event: string, data: any) {
    this.websockets.send(this.player1.socket, event, data);
    if (this.type != TypeMode.TRAINING)
      this.websockets.send(this.player2?.socket, event, data);
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
