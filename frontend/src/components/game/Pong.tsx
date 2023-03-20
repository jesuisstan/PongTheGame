import { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ScoreBar from './ScoreBar';
import GameBar from './GameBar';
import VictoryModal from './VictoryModal';
import { Player } from '../../types/Player';
import { Score } from '../../types/Score';
import * as util from './utils/gameUtils';
import styles from './Game.module.css';

const DEFAULT_WIN_SCORE = 3;
const DEFAULT_BALL_SPEED_X = 10;
const DEFAULT_BALL_SPEED_Y = 10;
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 800;
const FPS = 35;
const BALL_RADIUS = 10;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = CANVAS_HEIGHT / 6;
const PADDLE_COLOR = 'rgb(253, 80, 135)';
const DEFAULT_PADDLE_POSITION = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;

const OBSTACLE_HEIGHT = PADDLE_HEIGHT * 2;
const OBSTACLE_WIDTH = PADDLE_WIDTH;
const OBSTACLE_SPEED = 10;
let obstacleX = CANVAS_WIDTH / 2 - OBSTACLE_WIDTH / 2;
let obstacleY = 0;

let paddle1Y = DEFAULT_PADDLE_POSITION;
let paddle2Y = DEFAULT_PADDLE_POSITION;
let ballPosition = {
  X: CANVAS_WIDTH / 2,
  Y: CANVAS_HEIGHT / 2
};
let ballSpeed = {
  X: DEFAULT_BALL_SPEED_X,
  Y: DEFAULT_BALL_SPEED_Y
};

const setDefaultBallSpeed = () => {
  ballSpeed.X = DEFAULT_BALL_SPEED_X;
  ballSpeed.Y = DEFAULT_BALL_SPEED_Y;
};

const Pong: React.FC = () => {
  const { user } = useContext(UserContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [gameOn, setGameOn] = useState(false);
  const [player2, setPlayer2] = useState<Player>({
    avatar: undefined,
    id: -1,
    nickname: 'AI',
    profileId: '',
    provider: '',
    role: '',
    username: ''
  });
  const [winner, setWinner] = useState('');
  const [winScore, setWinScore] = useState(DEFAULT_WIN_SCORE);
  const [score, setScore] = useState<Score>({ player1: 0, player2: 0 });
  const [gamePaused, setGamePaused] = useState(false);
  const [trainMode, setTrainMode] = useState(false);
  const [bonusMode, setBonusMode] = useState(false);

  const setDefault = () => {
    setWinner('');
    setScore({ player1: 0, player2: 0 });
    setTrainMode(false);
    setBonusMode(false);
    setGamePaused(false);
    setDefaultBallSpeed();
    paddle1Y = DEFAULT_PADDLE_POSITION;
    paddle2Y = DEFAULT_PADDLE_POSITION;
  };

  const draw = (canvasContext: CanvasRenderingContext2D) => {
    util.makeRectangleShape(
      canvasContext,
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      'black'
    ); // Canvas
    new Array(CANVAS_HEIGHT).fill(0).map((c, i) => {
      if (i % 40 === 0) {
        util.makeRectangleShape(
          canvasContext,
          CANVAS_WIDTH / 2 - 1,
          i,
          2,
          32,
          'rgba(37, 120, 204, 0.5)'
        );
      }
    }); // Net
    util.makeCircleShape(
      canvasContext,
      ballPosition.X,
      ballPosition.Y,
      BALL_RADIUS,
      'whitesmoke'
    ); // Ball
    util.makeRectangleShape(
      canvasContext,
      0,
      paddle1Y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      PADDLE_COLOR
    ); // Left Paddle
    util.makeRectangleShape(
      canvasContext,
      CANVAS_WIDTH - PADDLE_WIDTH,
      paddle2Y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      PADDLE_COLOR
    ); // Right Paddle

    // if hard mode enabled --->
    if (bonusMode) {
      util.makeRectangleShape(
        canvasContext,
        obstacleX,
        obstacleY,
        OBSTACLE_WIDTH,
        OBSTACLE_HEIGHT,
        'rgba(37, 120, 204, 0.5)'
      ); // bonus obstacle
    }
  };

  const checkWinner = () => {
    if (score.player1 >= winScore || score.player2 >= winScore) {
      setGameOn(false);

      score.player1 > score.player2
        ? setWinner(user.nickname)
        : setWinner(player2.nickname);
      setOpen(true);
    }
  };

  const resetBall = () => {
    ballSpeed.X =
      ballSpeed.X > 0 ? -DEFAULT_BALL_SPEED_X : DEFAULT_BALL_SPEED_X;
    ballSpeed.Y =
      ballSpeed.Y > 0 ? -DEFAULT_BALL_SPEED_Y : DEFAULT_BALL_SPEED_Y;
    ballPosition.X = CANVAS_WIDTH / 2;
    ballPosition.Y = CANVAS_HEIGHT / 2;
    if (bonusMode) {
      obstacleY = 0;
    }
  };

  const computerAI = () => {
    if (trainMode) {
      let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
      let distanceThreshold = BALL_RADIUS * 2; // adjust this to change the paddle's reaction time

      let distanceToBall = Math.abs(paddle2YCenter - ballPosition.Y);
      if (distanceToBall > distanceThreshold) {
        if (paddle2YCenter < ballPosition.Y) {
          paddle2Y += 15;
        } else {
          paddle2Y -= 15;
        }
      }

      // Make sure paddle stays within bounds of the canvas
      if (paddle2Y < 0) {
        paddle2Y = 0;
      } else if (paddle2Y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
        paddle2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }
    }
  };

  const obstacleRun = () => {
    if (bonusMode) {
      if (obstacleY < CANVAS_HEIGHT) {
        obstacleY += OBSTACLE_SPEED;
      } else if (obstacleY >= CANVAS_HEIGHT - OBSTACLE_HEIGHT) {
        obstacleY = -OBSTACLE_HEIGHT;
      }
    }
  };

  const increaseScorePlayer2 = () => {
    setScore({ ...score, player2: (score.player2 += 1) });
    checkWinner();
    resetBall();
  };

  const increaseScorePlayer1 = () => {
    setScore({ ...score, player1: (score.player1 += 1) });
    checkWinner();
    resetBall();
  };

  const play = (canvasContext: CanvasRenderingContext2D) => {
    if (gamePaused) {
      util.printPause(canvasContext, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }
    if (!gameOn) {
      setDefaultBallSpeed();
      paddle2Y = DEFAULT_PADDLE_POSITION;
      return;
    } else {
      ballPosition.X += ballSpeed.X;
      ballPosition.Y += ballSpeed.Y;
    }

    computerAI();
    obstacleRun();

    if (ballPosition.X >= CANVAS_WIDTH + BALL_RADIUS * 2) {
      increaseScorePlayer1();
      util.printGoal(canvasContext, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    if (ballPosition.X <= -BALL_RADIUS * 2) {
      increaseScorePlayer2();
      util.printGoal(canvasContext, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Bounce the ball from bottom & top --->
    if (
      ballPosition.Y >= CANVAS_HEIGHT - BALL_RADIUS ||
      ballPosition.Y <= BALL_RADIUS
    ) {
      ballSpeed.Y = -ballSpeed.Y;
    }

    // Bounce the ball from the left paddle --->
    if (
      ballPosition.X === PADDLE_WIDTH + BALL_RADIUS &&
      ballPosition.Y >= paddle1Y - BALL_RADIUS &&
      ballPosition.Y <= paddle1Y + PADDLE_HEIGHT + BALL_RADIUS
    ) {
      ballSpeed.X = -ballSpeed.X;
      let deltaY = ballPosition.Y - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeed.Y = util.roundToTen(deltaY * 0.35);
    }
    if (
      ballPosition.X <= PADDLE_WIDTH &&
      (ballPosition.Y === paddle1Y - BALL_RADIUS ||
        ballPosition.Y === paddle1Y + PADDLE_HEIGHT + BALL_RADIUS)
    ) {
      ballSpeed.Y = -ballSpeed.Y;
      let deltaX = ballPosition.X - PADDLE_WIDTH;
      ballSpeed.X = deltaX !== 0 ? deltaX * 0.35 : -ballSpeed.X;
    }

    // Bounce the ball from the right paddle --->
    if (
      ballPosition.X === CANVAS_WIDTH - PADDLE_WIDTH - BALL_RADIUS &&
      ballPosition.Y >= paddle2Y - BALL_RADIUS &&
      ballPosition.Y <= paddle2Y + PADDLE_HEIGHT + BALL_RADIUS
    ) {
      ballSpeed.X = -ballSpeed.X;
      let deltaY = ballPosition.Y - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeed.Y = util.roundToTen(deltaY * 0.35);
    }
    if (
      ballPosition.X >= CANVAS_WIDTH - PADDLE_WIDTH &&
      (ballPosition.Y === paddle2Y - BALL_RADIUS ||
        ballPosition.Y === paddle2Y + PADDLE_HEIGHT + BALL_RADIUS)
    ) {
      ballSpeed.Y = -ballSpeed.Y;
      let deltaX = CANVAS_WIDTH - ballPosition.X - PADDLE_WIDTH;
      ballSpeed.X = deltaX !== 0 ? deltaX * 0.35 : -ballSpeed.X;
    }

    if (bonusMode) {
      // Bounce the ball from the obstacle
      if (
        (ballPosition.X === obstacleX - BALL_RADIUS ||
          ballPosition.X === obstacleX + PADDLE_WIDTH + BALL_RADIUS) &&
        ballPosition.Y >= obstacleY - BALL_RADIUS &&
        ballPosition.Y <= obstacleY + OBSTACLE_HEIGHT + BALL_RADIUS
      ) {
        ballSpeed.X = -ballSpeed.X;
        let deltaY = ballPosition.Y - (obstacleY + OBSTACLE_HEIGHT / 2);
        ballSpeed.Y = util.roundToTen(deltaY * 0.35);
      }

      // Bounce from obstacle's ribs
      if (
        ballPosition.X >= obstacleX - BALL_RADIUS &&
        ballPosition.X <= obstacleX + OBSTACLE_WIDTH + BALL_RADIUS &&
        (ballPosition.Y === obstacleY - BALL_RADIUS ||
          ballPosition.Y === obstacleY + OBSTACLE_HEIGHT + BALL_RADIUS)
      ) {
        ballSpeed.Y = -ballSpeed.Y;
        let deltaX = ballPosition.X - (obstacleX + OBSTACLE_WIDTH / 2);
        ballSpeed.X = util.roundToTen(deltaX * 0.35);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext('2d');

    if (!canvasContext) {
      return;
    }

    const paddleMoveListener = (evt: MouseEvent) => {
      let mousePos = util.calculateMousePosition(canvas!, evt);

      if (gameOn) {
        if (mousePos.y < PADDLE_HEIGHT / 2) {
          paddle1Y = 0;
        } else if (mousePos.y > canvas!.height - PADDLE_HEIGHT / 2) {
          paddle1Y = canvas!.height - PADDLE_HEIGHT;
        } else {
          paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
        }
      }
    };

    window.addEventListener('mousemove', paddleMoveListener);

    const intervalId = setInterval(() => {
      draw(canvasContext);
      play(canvasContext);
    }, 1000 / FPS);

    return () => {
      window.removeEventListener('mousemove', paddleMoveListener);
      clearInterval(intervalId);
    };
  }, [score.player1, score.player2, gamePaused, gameOn, bonusMode]);

  return (
    <div className={styles.canvasBlock}>
      <GameBar
        setTrainMode={setTrainMode}
        setScore={setScore}
        gameOn={gameOn}
        setGameOn={setGameOn}
        gamePaused={gamePaused}
        setGamePaused={setGamePaused}
        bonusMode={bonusMode}
        setBonusMode={setBonusMode}
      ></GameBar>
      <ScoreBar
        winScore={winScore}
        setWinScore={setWinScore}
        score={score}
        gameOn={gameOn}
        player2={player2}
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
        setDefault={setDefault}
      />
    </div>
  );
};

export default Pong;
