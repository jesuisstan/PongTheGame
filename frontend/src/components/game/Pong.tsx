import { useRef, useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import VictoryModal from './VictoryModal';

const indent = 10;
const winningScore = 3;
const framesPerSecond = 30;

const Pong: React.FC = () => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d');

    if (!canvasContext) {
      return;
    }

    canvasContext.font = '21px Helvetica';
    let gotWinner = true;

    let player1Score = 0;
    let player2Score = 0;

    let ballX = canvas!.width / 2;
    let ballY = canvas!.height / 2;
    let ballSpeedX = 10;
    let ballSpeedY = 4;

    const paddleColorX2 = 'rgb(253, 80, 135)';
    const paddleHeight = canvas!.height / 6;
    const paddleWidth = 10;
    let paddle1Y = canvas!.height / 2 - paddleHeight / 2;
    let paddle2Y = canvas!.height / 2 - paddleHeight / 2;

    const makeRectangleShape = (
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

    const draw = () => {
      makeRectangleShape(
        0,
        0,
        canvas!.width,
        canvas!.height,
        'rgba(0, 0, 0, 0.82)'
      ); // Canvas
      new Array(canvas!.height).fill(0).map((c, i) => {
        if (i % 40 === 0) {
          makeRectangleShape(
            canvas!.width / 2 - 1,
            i,
            2,
            32,
            'rgba(37, 120, 204, 0.5)'
          );
        }
      }); // Net
      makeRectangleShape(
        indent,
        paddle1Y,
        paddleWidth,
        paddleHeight,
        paddleColorX2
      ); // Left Paddle
      makeRectangleShape(
        canvas!.width - indent - paddleWidth,
        paddle2Y,
        paddleWidth,
        paddleHeight,
        paddleColorX2
      ); // Right Paddle
      makeCircleShape(ballX, ballY, 10, 0, 'whitesmoke'); // Ball creation
      canvasContext.fillText(
        `${user.nickname}: ${player1Score}`,
        canvas!.width / 4 - 100,
        42,
        200
      );
      canvasContext.fillText(
        `Other player: ${player2Score}`, // todo change to other player nickname
        canvas!.width / 2 + 100,
        42,
        200
      );
    };

    const computerAI = () => {
      let paddle2YCenter = paddle2Y + paddleHeight / 2;
      if (paddle2YCenter < ballY - 40) {
        paddle2Y += 13;
      } else if (paddle2YCenter < ballY + 40) {
        paddle2Y -= 13;
      }
    };

    const play = () => {
      //if (gotWinner) {
      //  if (player1Score >= winningScore) {
      //    setWinner('player 1');
      //    setOpen(true);
      //  }
      //  if (player2Score >= winningScore) {
      //    setWinner('player 2');
      //    setOpen(true);
      //  }
      //  return;
      //}

      if (gotWinner) {
        if (player1Score >= winningScore) {
          canvasContext.fillStyle = 'whitesmoke';
          canvasContext.font = '21px Helvetica';
          canvasContext.fillText(
            'YOU WIN ... Click to Play Again',
            canvas!.width / 2 - 150,
            canvas!.height / 4,
            300
          );
        }
        if (player2Score >= winningScore) {
          canvasContext.fillStyle = 'whitesmoke';
          canvasContext.font = '21px Helvetica';
          canvasContext.fillText(
            'YOU LOSE ... Click to Play Again',
            canvas!.width / 2 - 150,
            canvas!.height / 4,
            300
          );
        }
        return;
      }

      computerAI();

      ballX += ballSpeedX;
      ballY += ballSpeedY;

      const resetBall = () => {
        if (player1Score >= winningScore || player2Score >= winningScore) {
          gotWinner = true;
        }
        ballSpeedX = -ballSpeedX;
        ballX = canvas!.width / 2;
        ballY = canvas!.height / 2;
      };

      if (ballX > canvas!.width - indent) {
        player1Score += 1;
        resetBall();
      }

      if (ballX < indent) {
        player2Score += 1;
        resetBall();
      }

      // Bounce the ball from the right paddle --->
      if (
        ballX === canvas!.width - 2 * indent - paddleWidth &&
        ballY > paddle2Y &&
        ballY < paddle2Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX; // Bounce the ball
        let deltaY = ballY - (paddle2Y + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
      }

      // Bounce the ball from the left paddle --->
      if (
        ballX === 2 * indent + paddleWidth &&
        ballY > paddle1Y &&
        ballY < paddle1Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (paddle1Y + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
      }

      // Bounce the ball from top & bottom
      if (ballY > canvas!.height - indent) {
        ballSpeedY = -ballSpeedY;
      }
      if (ballY < indent) {
        ballSpeedY = -ballSpeedY;
      }
    };

    const CalculateMousePosition = (mouseEvent: any) => {
      let rect = canvas!.getBoundingClientRect();
      let root = document.documentElement;
      let mouseX = mouseEvent.clientX - rect.left - root.scrollLeft;
      let mouseY = mouseEvent.clientY - rect.top - root.scrollTop;
      return { x: mouseX, y: mouseY };
    };

    const handleMouseClick = (evt: any) => {
      if (gotWinner) {
        player1Score = 0;
        player2Score = 0;
        canvasContext.font = '21px Helvetica';
        gotWinner = false;
      }
    };

    canvas!.addEventListener('mousedown', handleMouseClick); // calls the function that restart the game when "MOUSE-CLICK"

    canvas!.addEventListener('mousemove', (evt) => {
      let mousePos = CalculateMousePosition(evt);
      paddle1Y = mousePos.y - paddleHeight / 2;
    });

    const intervalId = setInterval(() => {
      draw();
      play();
    }, 1000 / framesPerSecond);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={900} height={700} />
      <VictoryModal open={open} setOpen={setOpen} winner={winner} />
    </div>
  );
};

export default Pong;
