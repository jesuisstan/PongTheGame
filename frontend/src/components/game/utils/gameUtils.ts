import { Game_infos, Game_state, Player, Position } from "../game.interface";


export const makeRectangleShape = (
  canvasContext: CanvasRenderingContext2D,
  cX: number,
  cY: number,
  width: number,
  height: number,
  color: string
) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(cX, cY, width, height);
};

export const makeCircleShape = (
  canvasContext: CanvasRenderingContext2D,
  cX: number,
  cY: number,
  radius: number,
  color: string
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(cX, cY, radius, 90, Math.PI / 2, true);
  canvasContext.fill();
};

export const roundToTen = (num: number) => {
  return Math.round(num / 10) * 10;
};

export const roundToFive = (num: number) => {
  return Math.round(num / 5) * 5;
};

export const calculateMousePosition = (
  canvas: HTMLCanvasElement,
  mouseEvent: MouseEvent
) => {
  let rect = canvas!.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = roundToTen(mouseEvent.clientX - rect.left - root.scrollLeft);
  let mouseY = roundToTen(mouseEvent.clientY - rect.top - root.scrollTop);
  return { x: mouseX, y: mouseY };
};

export const printGoal = (
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  canvasContext.font = '100px Verdana';
  canvasContext.fillStyle = "whitesmoke";
  canvasContext.beginPath();
  canvasContext.fillText(
    'G',
    canvasWidth / 2 - 35,
    canvasHeight / 4 - 42
  );
  canvasContext.fillText(
    'O',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 2 - 42
  );
  canvasContext.fillText(
    'A',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 3 - 42
  );
  canvasContext.fillText(
    'L',
    canvasWidth / 2 - 35,
    (canvasHeight / 4) * 4 - 42
  );
};

export const printPause = (
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  canvasContext.font = '100px Verdana';
  canvasContext.fillStyle = "whitesmoke";
  canvasContext.beginPath();
  canvasContext.fillText(
    'P',
    canvasWidth / 6 - 35,
    canvasHeight / 2
  );
  canvasContext.fillText(
    'A',
    canvasWidth / 6 * 2 -35,
    canvasHeight /2
  );
  canvasContext.fillText(
    'U',
    canvasWidth / 6 * 3 - 35,
    canvasHeight /2
  );
  canvasContext.fillText(
    'S',
    canvasWidth / 6 * 4 - 35,
    canvasHeight / 2
  );
  canvasContext.fillText(
    'E',
    canvasWidth / 6 * 5 - 35,
    canvasHeight / 2
  );
};

function drawRect(
	ctx: any,
	color: string,
	x: number,
	y: number,
	width: number,
	height: number,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	for (let i = 0; i < width; i++) {
		ctx.rect(x + i, y, 1, height);
	}
	ctx.fill();
}

function drawPaddle(
	ctx: any,
	player: Player,
	color: string,
	gameInfos: Game_infos,
) {
	if (player.current) {
		drawRect(
			ctx,
			'#ff0000',
			player.paddle.x - 2,
			player.paddle.y - 2,
			gameInfos.paddleWidth + 4,
			gameInfos.paddleHeight + 4,
		);
	}
	drawRect(
		ctx,
		color,
		player.paddle.x,
		player.paddle.y,
		gameInfos.paddleWidth,
		gameInfos.paddleHeight,
	);
}

function clearPaddle(
	ctx: any,
	player: Position,
	color: string,
	gameInfos: Game_infos,
) {
	if (player) {
		drawRect(
			ctx,
			'#ff0000',
			player.x - 2,
			player.y - 2,
			gameInfos.paddleWidth + 4,
			gameInfos.paddleHeight + 4,
		);
	}
	drawRect(
		ctx,
		color,
		player.x,
		player.y,
		gameInfos.paddleWidth,
		gameInfos.paddleHeight,
	);
}

function drawBall(
	ctx: any,
	color: string,
	ball: Position,
	gameInfos: Game_infos,
) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, gameInfos.ballRadius, 0, 2 * Math.PI);
	ctx.fill();
}

export function draw_state(state: Game_state, canvasRef: any) {
	if (!canvasRef.current) return;
	const canvas: any = canvasRef.current;
	const ctx = canvas.getContext('2d');

	ctx.canvas.width = state.gameInfos.originalWidth;
	ctx.canvas.height = state.gameInfos.originalHeight;

	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();

	drawBall(ctx, '#ffffff', state.ball, state.gameInfos);

	drawPaddle(ctx, state.player1, '#abcdef', state.gameInfos);
	drawPaddle(ctx, state.player2, '#fedcba', state.gameInfos);
  return ctx;
}

export function draw_state_2(ctx : any , last_state : Position[], actual_state: Game_state, canvasRef: any) {
	if (!canvasRef.current) return;
	// const canvas: any = canvasRef.current;// check if is that
	// const ctx = canvas.getContext('2d');


  drawBall(ctx, '#000000', last_state[2], actual_state.gameInfos);

	clearPaddle(ctx, last_state[0], '#000000', actual_state.gameInfos);
	clearPaddle(ctx, last_state[1], '#000000', actual_state.gameInfos);

	drawBall(ctx, '#ffffff', actual_state.ball, actual_state.gameInfos);

	drawPaddle(ctx, actual_state.player1, '#abcdef', actual_state.gameInfos);
	drawPaddle(ctx, actual_state.player2, '#fedcba', actual_state.gameInfos);

}
