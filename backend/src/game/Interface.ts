import { Socket } from 'socket.io';
import { User } from '@prisma/client';

export enum Status {
  STARTING = 'starting',
  PLAYING = 'playing',
  ENDED = 'ended',
  ABORTED = 'aborted',
}

export enum InvitationState {
  PENDING = 'Pending',
  PLAYING = 'playing',
  FINISHED = 'Finished',
}

export enum TypeMode {
  NORMAL = 'Normal',
  TRAINING = 'Training',
  CUSTOM = 'Custom',
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
  profile?: Profile;
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
  winScore: number;
  obstacleHeight?: number;
  obstacleWidth?: number;
}

export interface Obstacle {
  position: Position;
  direction: number;
}

export interface GameState {
  gameInfos: GameInfos;
  player1: Player;
  player2: Player;
  ball: Ball;
  obstacle?: Obstacle;
}
