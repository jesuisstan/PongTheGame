import { useRef, useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import VictoryModal from './VictoryModal';
import ButtonPong from '../UI/ButtonPong';

const canvasHeight = 700;
const canvasWidth = 900;
const indent = 5;
const winScore = 3;
const framesPerSecond = 30;
const paddleWidth = 10;
const paddleHeight = canvasHeight / 6;
const paddleColor = 'rgb(253, 80, 135)';
let ballSpeedX = 10;
let ballSpeedY = 4;
let paddle1Y = canvasHeight / 2 - paddleHeight / 2;
let paddle2Y = canvasHeight / 2 - paddleHeight / 2;
let gameState = {
  gotWinner: true,
  player1Score: 0,
  player2Score: 0,
  ballX: canvasWidth / 2,
  ballY: canvasHeight / 2
};

const Pong: React.FC = () => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState('');

  const makeRectangleShape = (
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

  const makeCircleShape = (
    canvasContext: CanvasRenderingContext2D,
    cX: number,
    cY: number,
    radious: number,
    angle: number,
    color: string
  ) => {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(cX, cY, radious, angle, Math.PI * 2, true);
    canvasContext.fill();
  };

  const draw = (canvasContext: CanvasRenderingContext2D) => {
    makeRectangleShape(canvasContext, 0, 0, canvasWidth, canvasHeight, 'black'); // Canvas
    new Array(canvasHeight).fill(0).map((c, i) => {
      if (i % 40 === 0) {
        makeRectangleShape(
          canvasContext,
          canvasWidth / 2 - 1,
          i,
          2,
          32,
          'rgba(37, 120, 204, 0.5)'
        );
      }
    }); // Net
    makeRectangleShape(
      canvasContext,
      indent,
      paddle1Y,
      paddleWidth,
      paddleHeight,
      paddleColor
    ); // Left Paddle
    makeRectangleShape(
      canvasContext,
      canvasWidth - indent - paddleWidth,
      paddle2Y,
      paddleWidth,
      paddleHeight,
      paddleColor
    ); // Right Paddle
    makeCircleShape(
      canvasContext,
      gameState.ballX,
      gameState.ballY,
      10,
      0,
      'whitesmoke'
    ); // Ball creation
    canvasContext.fillText(
      `${user.nickname}: ${gameState.player1Score}`,
      canvasWidth / 4 - 100,
      42,
      200
    );
    canvasContext.fillText(
      `Opponent: ${gameState.player2Score}`, // todo change to other player nickname
      canvasWidth / 2 + 100,
      42,
      200
    );
  };

  const resetBall = () => {
    if (
      gameState.player1Score >= winScore ||
      gameState.player2Score >= winScore
    ) {
      gameState.gotWinner = true;
      setOpen(true);
    }
    ballSpeedX = -ballSpeedX;
    gameState.ballX = canvasWidth / 2;
    gameState.ballY = canvasHeight / 2;
  };

  const computerAI = () => {
    let paddle2YCenter = paddle2Y + paddleHeight / 2;
    if (paddle2YCenter < gameState.ballY - 40) {
      paddle2Y += 13;
    } else if (paddle2YCenter < gameState.ballY + 40) {
      paddle2Y -= 13;
    }
  };

  const play = (canvasContext: CanvasRenderingContext2D) => {
    if (gameState.gotWinner) {
      if (gameState.player1Score >= winScore) {
        setWinner(user.nickname);
      }
      if (gameState.player2Score >= winScore) {
        setWinner('Opponent');
      }
      canvasContext.fillStyle = 'whitesmoke';
      canvasContext.font = '21px Helvetica';
      canvasContext.fillText(
        'Click to play again',
        canvasWidth / 2 - 81,
        canvasHeight / 4,
        300
      );
      return;
    }

    computerAI();

    gameState.ballX += ballSpeedX;
    gameState.ballY += ballSpeedY;

    if (gameState.ballX > canvasWidth) {
      gameState.player1Score += 1;
      resetBall();
    }

    if (gameState.ballX < 0) {
      gameState.player2Score += 1;
      resetBall();
    }

    // Bounce the ball from the right paddle --->
    if (
      gameState.ballX === canvasWidth - 2 * indent - paddleWidth &&
      gameState.ballY > paddle2Y &&
      gameState.ballY < paddle2Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX; // Bounce the ball
      let deltaY = gameState.ballY - (paddle2Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    }

    // Bounce the ball from the left paddle --->
    if (
      gameState.ballX === 2 * indent + paddleWidth &&
      gameState.ballY > paddle1Y &&
      gameState.ballY < paddle1Y + paddleHeight
    ) {
      ballSpeedX = -ballSpeedX;
      let deltaY = gameState.ballY - (paddle1Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    }

    // Bounce the ball from top & bottom --->
    if (gameState.ballY > canvasHeight - indent) {
      ballSpeedY = -ballSpeedY;
    }
    if (gameState.ballY < indent) {
      ballSpeedY = -ballSpeedY;
    }
  };

  const calculateMousePosition = (
    canvas: HTMLCanvasElement,
    mouseEvent: any
  ) => {
    let rect = canvas!.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
    let mouseY = mouseEvent.clientY - rect.top - root.scrollTop;
    return { x: mouseX, y: mouseY };
  };

  const handleMouseClick = (evt: MouseEvent) => {
    if (gameState.gotWinner) {
      gameState.player1Score = 0;
      gameState.player2Score = 0;
      gameState.gotWinner = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d');

    if (!canvasContext) {
      return;
    }

    canvas!.addEventListener('mousedown', handleMouseClick); // calls the function that restart the game when "MOUSE-CLICK"

    canvas!.addEventListener('mousemove', (evt) => {
      let mousePos = calculateMousePosition(canvas!, evt);
      paddle1Y = mousePos.y - paddleHeight / 2;
    });

    const intervalId = setInterval(() => {
      draw(canvasContext);
      play(canvasContext);
    }, 1000 / framesPerSecond);

    return () => clearInterval(intervalId);
  }, [gameState]);

  return (
    <div>
      <ButtonPong text="Start game" onClick={() => console.log('fff')} />
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      <VictoryModal open={open} setOpen={setOpen} winner={winner} />
    </div>
  );
};

export default Pong;
