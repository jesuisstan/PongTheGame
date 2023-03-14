import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

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

export interface Player {
  profile: Socket;
  paddle: Position;
  score: number;
  event: 'up' | 'down' | null;
}

export interface IBall {
  position: Position;
  direction: Position;
  velocity: number;
  collidable: boolean;
  portalUsable: boolean;
}

export const DefaultParams = {
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
  PORTAL_WIDTH: 20,
  PORTAL_HEIGHT: 40,
  PORTAL_OFFSET: 100,
  PORTAL_MIN_SPEED: 2,
  PORTAL_MAX_SPEED: 5,
};

export class Game {
  private player1: Socket;
  private player2: Socket;
  private status: Status = Status.STARTING;
  private spectatorSockets: Socket[] = [];
  private startCounter = 10;
  private gameStartTime: Date | null = null;
  // private _gameState: IGameState;

  constructor(
    private readonly prismaService: PrismaService,
    player1: Socket,
    player2: Socket,
  ) {
    this.player1 = player1;
    this.player2 = player2;
  }
}
