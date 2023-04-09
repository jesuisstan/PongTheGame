import { GameInfo, GameState, Obstacle, Player, Position } from '../game.interface';
import * as colorPong from '../../UI/colorsPong'


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

 export const printGoal = (
   canvasContext: CanvasRenderingContext2D,
   canvasWidth: number,
   canvasHeight: number
 ) => {
   canvasContext.font = '50px Verdana';
   canvasContext.fillStyle = colorPong.PONG_WHITE;
   canvasContext.beginPath();
   canvasContext.fillText('G', canvasWidth / 2 - 18, canvasHeight / 4 - 60);
   canvasContext.fillText(
     'O',
     canvasWidth / 2 - 18,
     (canvasHeight / 4) * 2 - 60
   );
   canvasContext.fillText(
     'A',
     canvasWidth / 2 - 18,
     (canvasHeight / 4) * 3 - 60
   );
   canvasContext.fillText(
     'L',
     canvasWidth / 2 - 18,
     (canvasHeight / 4) * 4 - 60
   );
 };

const drawRect = (
  canvasContext: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  for (let i = 0; i < width; i++) {
    canvasContext.rect(x + i, y, 1, height);
  }
  canvasContext.fill();
};

const drawNet = (
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  new Array(canvasHeight).fill(0).map((c, i) => {
    if (i % 40 === 0) {
      makeRectangleShape(
        canvasContext,
        canvasWidth / 2 - 1,
        i,
        2,
        32,
        colorPong.PONG_BLUE_TRANS
      );
    }
  });
};

const drawPaddle = (
  canvasContext: CanvasRenderingContext2D,
  player: Player,
  color: string,
  gameInfos: GameInfo
) => {
  if (player.current) {
    drawRect(
      canvasContext,
      colorPong.PONG_WHITE,
      player.paddle.x - 2,
      player.paddle.y - 2,
      gameInfos.paddleWidth + 4,
      gameInfos.paddleHeight + 4
    );
  }
  drawRect(
    canvasContext,
    color,
    player.paddle.x,
    player.paddle.y,
    gameInfos.paddleWidth,
    gameInfos.paddleHeight
  );
};

const drawObstacle = (
  canvasContext: CanvasRenderingContext2D,
  color: string,
  gameInfos: GameInfo,
  obstacle : Obstacle,
) => {
  if (!gameInfos.obstacleHeight || !gameInfos.obstacleWidth)
    return ;
  drawRect(
    canvasContext,
    color,
    obstacle.position.x,
    obstacle.position.y,
    gameInfos.obstacleWidth,
    gameInfos.obstacleHeight,
  );
};

const drawBall = (
  canvasContext: CanvasRenderingContext2D,
  color: string,
  ball: Position,
  gameInfos: GameInfo
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(ball.x, ball.y, gameInfos.ballRadius, 0, 2 * Math.PI);
  canvasContext.fill();
};

export const drawState = (state: GameState, canvasRef: any) => {
  if (!canvasRef.current) return;
  const canvas: any = canvasRef.current;
  const canvasContext = canvas.getContext('2d');

  canvasContext.canvas.width = state.gameInfos.originalWidth;
  canvasContext.canvas.height = state.gameInfos.originalHeight;

  canvasContext.fillStyle = 'black';
  canvasContext.beginPath();
  canvasContext.rect(0, 0, canvas.width, canvas.height);
  canvasContext.fill();
  drawNet(canvasContext, canvas.width, canvas.height);
  drawBall(canvasContext, colorPong.PONG_WHITE, state.ball, state.gameInfos);

  if (state.obstacle)
    drawObstacle(canvasContext, colorPong.PONG_BLUE_TRANS, state.gameInfos, state.obstacle);
  drawPaddle(canvasContext, state.player1, colorPong.PONG_PINK , state.gameInfos);
  drawPaddle(canvasContext, state.player2, colorPong.PONG_PINK, state.gameInfos);
  return canvasContext;
};

