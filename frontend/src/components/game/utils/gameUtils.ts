import { Game_infos, Game_state, Obstacle, Player, Position } from '../game.interface';
import * as color from '../../UI/colorsPong'


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

// export const printGoal = (
//   canvasContext: CanvasRenderingContext2D,
//   canvasWidth: number,
//   canvasHeight: number
// ) => {
//   canvasContext.font = '100px Verdana';
//   canvasContext.fillStyle = 'whitesmoke';
//   canvasContext.beginPath();
//   canvasContext.fillText('G', canvasWidth / 2 - 35, canvasHeight / 4 - 42);
//   canvasContext.fillText(
//     'O',
//     canvasWidth / 2 - 35,
//     (canvasHeight / 4) * 2 - 42
//   );
//   canvasContext.fillText(
//     'A',
//     canvasWidth / 2 - 35,
//     (canvasHeight / 4) * 3 - 42
//   );
//   canvasContext.fillText(
//     'L',
//     canvasWidth / 2 - 35,
//     (canvasHeight / 4) * 4 - 42
//   );
// };

// export const printPause = (
//   canvasContext: CanvasRenderingContext2D,
//   canvasWidth: number,
//   canvasHeight: number
// ) => {
//   canvasContext.font = '100px Verdana';
//   canvasContext.fillStyle = 'whitesmoke';
//   canvasContext.beginPath();
//   canvasContext.fillText('P', canvasWidth / 6 - 35, canvasHeight / 2);
//   canvasContext.fillText('A', (canvasWidth / 6) * 2 - 35, canvasHeight / 2);
//   canvasContext.fillText('U', (canvasWidth / 6) * 3 - 35, canvasHeight / 2);
//   canvasContext.fillText('S', (canvasWidth / 6) * 4 - 35, canvasHeight / 2);
//   canvasContext.fillText('E', (canvasWidth / 6) * 5 - 35, canvasHeight / 2);
// };

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
        color.PONG_BLUE_TRANS
      );
    }
  });
};

const drawPaddle = (
  canvasContext: CanvasRenderingContext2D,
  player: Player,
  color: string,
  gameInfos: Game_infos
) => {
  if (player.current) {
    drawRect(
      canvasContext,
      'whitesmoke',
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
  gameInfos: Game_infos,
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
  gameInfos: Game_infos
) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(ball.x, ball.y, gameInfos.ballRadius, 0, 2 * Math.PI);
  canvasContext.fill();
};

export const drawState = (state: Game_state, canvasRef: any) => {
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
  drawBall(canvasContext, 'whitesmoke', state.ball, state.gameInfos);

  if (state.obstacle)
    drawObstacle(canvasContext, color.PONG_BLUE_TRANS, state.gameInfos, state.obstacle);
  drawPaddle(canvasContext, state.player1, color.PONG_PINK , state.gameInfos);
  drawPaddle(canvasContext, state.player2, color.PONG_PINK, state.gameInfos);
  return canvasContext;
};

