import { Socket } from 'socket.io';
import { User } from '@prisma/client';

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
