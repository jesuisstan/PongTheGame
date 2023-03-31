export interface Info_player {
	name: string;
	profile_picture: string;
}

export interface Game_infos {
	originalWidth: number;
	originalHeight: number;
	paddleHeight: number;
	paddleWidth: number;
	ballRadius: number;
	time: number;
	obstacleHeight? : number;
	obstacleWidth? : number;
}

export interface Obstacle {
	position : Position;
	direction : number;
  }

export interface Player_game {
	infos: Info_player;
	score: number;
}

export interface Result_game {
	winner: {
		name: string;
		avatar: string;
		score: number;
	};
	loser: {
		name: string;
		avatar: string;
		score: number;
	};
	duration: number;
}

export interface Props_game {
  players?: Player_game[];
	endMatch?: (result: Result_game) => void;
	spectator: boolean;
	gameState: Game_status;
	setGameState: (gameState: Game_status) => void;
}

export interface Position {
	x: number;
	y: number;
}

export enum Game_status {
	LOBBY = 'lobby',
	BEGIN_GAME = 'begin_game',
	QUEUE = 'queue',
	PLAYING = 'playing',
	SPECTATE = 'spectate',
	ENDED='ended',
}

export interface Player {
	infos: Player_game;
	current: boolean;
	paddle: Position;
}

export interface Game_state {
	gameInfos: Game_infos;
	player1: Player;
	player2: Player;
	ball: Position;
	obstacle?: Obstacle;
}

export interface Game_result {
	winner: {
		id: number;
		name: string;
		avatar: string;
		score: number;
		position: 1 | 2;
	};
	loser: {
		id: number;
		name: string;
		avatar: string;
		score: number;
		position: 1 | 2;
	};
	duration: number;
}

export interface Player_info {
	name: string;
	profile_picture: string;
}

export interface Game_player {
	infos: Player_info;
	score: number;
}