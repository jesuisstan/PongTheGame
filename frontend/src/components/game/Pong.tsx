import { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ScoreBar from './ScoreBar';
import VictoryModal from './VictoryModal';
import ButtonPong from '../UI/ButtonPong';
import styles from './Game.module.css';

const DEFAULT_WIN_SCORE = 3;
const DEFAULT_BALL_SPEED_X = 10;
const DEFAULT_BALL_SPEED_Y = 5;
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 800;
const FPS = 30;
const BALL_RADIUS = 10;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = CANVAS_HEIGHT / 6;
const PADDLE_COLOUR = 'rgb(253, 80, 135)';

let paddle1Y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let paddle2Y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballPosition = {
  X: CANVAS_WIDTH / 2,
  Y: CANVAS_HEIGHT / 2
};
let ballSpeed = {
  X: DEFAULT_BALL_SPEED_X,
  Y: DEFAULT_BALL_SPEED_Y
};
let deltaY = 0;
let gotWinner = true;

const Pong: React.FC = () => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [winner, setWinner] = useState('');
  const [winScore, setWinScore] = useState(DEFAULT_WIN_SCORE);
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
    makeRectangleShape(canvasContext, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 'black'); // Canvas
    new Array(CANVAS_HEIGHT).fill(0).map((c, i) => {
      if (i % 40 === 0) {
        makeRectangleShape(
          canvasContext,
          CANVAS_WIDTH / 2 - 1,
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
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      PADDLE_COLOUR
    ); // Left Paddle
    makeRectangleShape(
      canvasContext,
      CANVAS_WIDTH - PADDLE_WIDTH,
      paddle2Y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      PADDLE_COLOUR
    ); // Right Paddle
    makeCircleShape(
      canvasContext,
      ballPosition.X,
      ballPosition.Y,
      BALL_RADIUS,
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
    ballSpeed.X = ballSpeed.X > 0 ? -10 : 10;
    ballSpeed.Y = -ballSpeed.Y;
    ballPosition.X = CANVAS_WIDTH / 2;
    ballPosition.Y = CANVAS_HEIGHT / 2;
  };

  const computerAI = () => {
    let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
    if (paddle2YCenter < ballPosition.Y - 40) {
      paddle2Y += 13;
    } else if (paddle2YCenter < ballPosition.Y + 40) {
      paddle2Y -= 13;
    }
  };

  const increaseScorePlayer2 = () => {
    setScore({ ...score, player2: (score.player2 += 1) });
    resetBall();
  };

  const increaseScorePlayer1 = () => {
    setScore({ ...score, player1: (score.player1 += 1) });
    resetBall();
  };

  const setDefaultBallSpeed = () => {
    ballSpeed.X = DEFAULT_BALL_SPEED_X;
    ballSpeed.Y = DEFAULT_BALL_SPEED_Y;
  };

  const play = (canvasContext: CanvasRenderingContext2D) => {
    if (gotWinner) {
      setDefaultBallSpeed();
      return;
    } else {
      ballPosition.X += ballSpeed.X;
      ballPosition.Y += ballSpeed.Y;
    }

    if (score.player1 >= winScore || score.player2 >= winScore) {
      resetBall();
    }

    computerAI();

    if (ballPosition.X >= CANVAS_WIDTH + BALL_RADIUS * 2) {
      increaseScorePlayer1();
    }

    if (ballPosition.X <= -BALL_RADIUS * 2) {
      increaseScorePlayer2();
    }

    // Bounce the ball from the right paddle --->
    if (
      ballPosition.X === CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS &&
      ballPosition.Y > paddle2Y - BALL_RADIUS &&
      ballPosition.Y < paddle2Y + PADDLE_HEIGHT + BALL_RADIUS
    ) {
      ballSpeed.X = -ballSpeed.X;
      deltaY = ballPosition.Y - (paddle2Y + PADDLE_HEIGHT / 2);
      console.log('deltaY = ');

      ballSpeed.Y = Math.round(deltaY * 0.35);
      console.log(ballSpeed.Y);
    }

    // Bounce the ball from the left paddle --->
    if (
      ballPosition.X === PADDLE_WIDTH + BALL_RADIUS &&
      ballPosition.Y > paddle1Y - BALL_RADIUS &&
      ballPosition.Y < paddle1Y + PADDLE_HEIGHT + BALL_RADIUS
    ) {
      ballSpeed.X = -ballSpeed.X;
      deltaY = ballPosition.Y - (paddle1Y + PADDLE_HEIGHT / 2);
      console.log('deltaY = ');

      ballSpeed.Y = Math.round(deltaY * 0.35);
      console.log(ballSpeed.Y);
    }
    if (
      ballPosition.X < PADDLE_WIDTH &&
      ballPosition.Y >= paddle1Y &&
      ballPosition.Y <= paddle1Y + PADDLE_HEIGHT
    ) {
      ballSpeed.Y = -ballSpeed.Y;
      let deltaX = ballPosition.X - PADDLE_WIDTH;

      ballSpeed.X = Math.round(deltaX * 0.35);
      console.log(ballSpeed.X);
      console.log(`deltaXXX = ${ballSpeed.X}`);
    }

    // Bounce the ball from bottom & top --->
    if (ballPosition.Y >= CANVAS_HEIGHT - BALL_RADIUS) {
      console.log(ballPosition.Y);

      ballSpeed.Y = -ballSpeed.Y;
    }
    if (ballPosition.Y <= BALL_RADIUS) {
      console.log(ballPosition.Y);

      ballSpeed.Y = -ballSpeed.Y;
    }
  };

  const calculateMousePosition = (
    canvas: HTMLCanvasElement,
    mouseEvent: MouseEvent
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

      if (mousePos.y < PADDLE_HEIGHT / 2) {
        paddle1Y = 0;
      } else if (mousePos.y > canvas!.height - PADDLE_HEIGHT / 2) {
        paddle1Y = canvas!.height - PADDLE_HEIGHT;
      } else {
        paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
      }
    });

    const intervalId = setInterval(() => {
      draw(canvasContext);
      play(canvasContext);
    }, 1000 / FPS);

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
        gotWinner={gotWinner}
      ></ScoreBar>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
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
