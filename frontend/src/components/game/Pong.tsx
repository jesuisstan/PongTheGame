import { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ScoreBar from './ScoreBar';
import VictoryModal from './VictoryModal';
import ButtonPong from '../UI/ButtonPong';
import styles from './Game.module.css';

const canvasHeight = 600;
const canvasWidth = 800;
const framesPerSecond = 30;
const ballRadius = 10;
const paddleWidth = 10;
const paddleHeight = canvasHeight / 6;
const paddleColor = 'rgb(253, 80, 135)';
let ballSpeedX = 10;
let ballSpeedY = 5;
let paddle1Y = canvasHeight / 2 - paddleHeight / 2;
let paddle2Y = canvasHeight / 2 - paddleHeight / 2;
let ballPosition = {
  X: canvasWidth / 2,
  Y: canvasHeight / 2
};
let deltaY = 0;
let gotWinner = true;

const Pong: React.FC = () => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState('');
  const [winScore, setWinScore] = useState(3);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  
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
    radius: number,
    color: string
  ) => {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(cX, cY, radius, 90, Math.PI / 2, true);
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
      0,
      paddle1Y,
      paddleWidth,
      paddleHeight,
      paddleColor
    ); // Left Paddle
    makeRectangleShape(
      canvasContext,
      canvasWidth - paddleWidth,
      paddle2Y,
      paddleWidth,
      paddleHeight,
      paddleColor
    ); // Right Paddle
    makeCircleShape(
      canvasContext,
      ballPosition.X,
      ballPosition.Y,
      ballRadius,
      'whitesmoke'
    ); // Ball
  };

  const resetBall = () => {
    if (score.player1 >= winScore || score.player2 >= winScore) {
      gotWinner = true;
      score.player1 > score.player2
        ? setWinner(user.nickname)
        : setWinner('Opponent'); // todo change 'opponent' name
      setOpen(true);
    }
    ballSpeedX = ballSpeedX > 0 ? -10 : 10;
    ballSpeedY = -ballSpeedY;
    ballPosition.X = canvasWidth / 2;
    ballPosition.Y = canvasHeight / 2;
  };

  const computerAI = () => {
    let paddle2YCenter = paddle2Y + paddleHeight / 2;
    if (paddle2YCenter < ballPosition.Y - 40) {
      paddle2Y += 13;
    } else if (paddle2YCenter < ballPosition.Y + 40) {
      paddle2Y -= 13;
    }
  };

  const increaseScorePlayer2 = () => {
    setScore({ ...score, player2: (score.player2 += 1) });
    console.log(score);

    //setscore.player2((score.player2: number) => score.player2 + 1);
    resetBall();
  };

  const increaseScorePlayer1 = () => {
    setScore({ ...score, player1: (score.player1 += 1) });

    //setscore.player1((score.player1: number) => score.player1 + 1);
    resetBall();
  };

  const setDefaultBallSpeed = () => {
    ballSpeedX = 10;
    ballSpeedY = 5;
  };

  const play = (canvasContext: CanvasRenderingContext2D) => {
    if (gotWinner) {
      setDefaultBallSpeed();
      return;
    } else {
      ballPosition.X += ballSpeedX;
      ballPosition.Y += ballSpeedY;
    }

    if (score.player1 >= winScore || score.player2 >= winScore) {
      resetBall();
    }

    computerAI();

    if (ballPosition.X >= canvasWidth + ballRadius * 2) {
      increaseScorePlayer1();
    }

    if (ballPosition.X <= -ballRadius * 2) {
      increaseScorePlayer2();
    }

    // Bounce the ball from the right paddle --->
    if (
      ballPosition.X === canvasWidth - paddleWidth - ballRadius &&
      ballPosition.Y > paddle2Y - ballRadius &&
      ballPosition.Y < paddle2Y + paddleHeight + ballRadius
    ) {
      ballSpeedX = -ballSpeedX;
      deltaY = ballPosition.Y - (paddle2Y + paddleHeight / 2);
      console.log('deltaY = ');

      ballSpeedY = Math.round(deltaY * 0.35);
      console.log(ballSpeedY);
    }

    // Bounce the ball from the left paddle --->
    if (
      ballPosition.X === paddleWidth + ballRadius &&
      ballPosition.Y > paddle1Y - ballRadius &&
      ballPosition.Y < paddle1Y + paddleHeight + ballRadius
    ) {
      ballSpeedX = -ballSpeedX;
      deltaY = ballPosition.Y - (paddle1Y + paddleHeight / 2);
      console.log('deltaY = ');

      ballSpeedY = Math.round(deltaY * 0.35);
      console.log(ballSpeedY);
    }
    if (
      ballPosition.X < paddleWidth &&
      ballPosition.Y >= paddle1Y &&
      ballPosition.Y <= paddle1Y + paddleHeight
    ) {
      ballSpeedY = -ballSpeedY;
      let deltaX = ballPosition.X - paddleWidth;

      ballSpeedX = Math.round(deltaX * 0.35);
      console.log(ballSpeedX);
      console.log(`deltaXXX = ${ballSpeedX}`);
    }

    // Bounce the ball from bottom & top --->
    if (ballPosition.Y >= canvasHeight - ballRadius) {
      console.log(ballPosition.Y);

      ballSpeedY = -ballSpeedY;
    }
    if (ballPosition.Y <= ballRadius) {
      console.log(ballPosition.Y);

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
    if (gotWinner) {
      setScore({ player1: 0, player2: 0 });
      gotWinner = false;
    }
  };

  const trainWithComputer = async () => {
    if (gotWinner) {
      setScore({ player1: 0, player2: 0 });
      gotWinner = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d');

    if (!canvasContext) {
      return;
    }

    canvas!.addEventListener('mousedown', handleMouseClick); // restarts the game when "MOUSE-CLICK"

    window.addEventListener('mousemove', (evt) => {
      let mousePos = calculateMousePosition(canvas!, evt);
      //console.log(mousePos);

      if (mousePos.y < paddleHeight / 2) {
        paddle1Y = 0;
      } else if (mousePos.y > canvas!.height - paddleHeight / 2) {
        paddle1Y = canvas!.height - paddleHeight;
      } else {
        paddle1Y = mousePos.y - paddleHeight / 2;
      }
    });

    const intervalId = setInterval(() => {
      draw(canvasContext);
      play(canvasContext);
    }, 1000 / framesPerSecond);

    return () => clearInterval(intervalId);
  }, [score.player1, score.player2]);

  return (
    <div className={styles.canvasBlock}>
      <div className={styles.buttonsBlock}>
        <ButtonPong text="train with AI" onClick={trainWithComputer} />
        <ButtonPong
          text="Find opponent"
          onClick={() => console.log('find opp clicked')}
        />
        <ButtonPong
          text="Smth else"
          onClick={() => console.log('Smth else clicked')}
        />
      </div>
      <ScoreBar
        winScore={winScore}
        setWinScore={setWinScore}
        score={score}
        dis={gotWinner}
      ></ScoreBar>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
      <VictoryModal
        open={open}
        setOpen={setOpen}
        winner={winner}
        score={score}
      />
    </div>
  );
};

export default Pong;
