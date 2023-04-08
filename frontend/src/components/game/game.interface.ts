export interface GameInfo {
  originalWidth: number;
  originalHeight: number;
  paddleHeight: number;
  paddleWidth: number;
  ballRadius: number;
  winScore: number;
  time: number;
  obstacleHeight?: number;
  obstacleWidth?: number;
}

export interface Obstacle {
  position: Position;
  direction: number;
}

export interface GameProps {
  players?: CurrentGamePlayer[];
  setEndMatch: (result: GameResult) => void;
  spectator: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  gameInfos: GameInfo;
  player1: Player;
  player2: Player;
  ball: Position;
  obstacle?: Obstacle;
}

export interface GameResult {
  winner: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  };
  loser: {
    id: number;
    name: string;
    avatar: string;
    score: number;
  };
  reason: string;
}

export enum GameStatus {
  LOBBY = 'lobby',
  BEGIN_GAME = 'begin_game',
  QUEUE = 'queue',
  PLAYING = 'playing',
  SPECTATE = 'spectate',
  ENDED = 'ended'
}

export interface PlayerData {
  name: string;
  profile_picture: string;
}

export interface CurrentGamePlayer {
  infos: PlayerData;
  score: number;
}

export interface Player {
  infos: CurrentGamePlayer;
  current: boolean;
  paddle: Position;
}
