import { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ScoreBar from './ScoreBar';
import GameBar from './GameBar';
import VictoryModal from './VictoryModal';
import ButtonPong from '../UI/ButtonPong';
import { Player } from '../../types/Player';
import { Score } from '../../types/Score';
import * as util from './gameUtils';
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

const obstacleLeftBottomX = CANVAS_WIDTH / 4;
const obstacleLeftBottomY = CANVAS_HEIGHT - PADDLE_HEIGHT;
const obstacleLeftTopX = CANVAS_WIDTH / 4 + PADDLE_WIDTH * 2;
const obstacleLeftTopY = 0;
const obstacleRightTopX = CANVAS_WIDTH - CANVAS_WIDTH / 4 - PADDLE_WIDTH;
const obstacleRightTopY = 0;
const obstacleRightBottomX = CANVAS_WIDTH - CANVAS_WIDTH / 4 - PADDLE_WIDTH * 3;
const obstacleRightBottomY = CANVAS_HEIGHT - PADDLE_HEIGHT;

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
    achievements: null,
    avatar: undefined,
    id: -1,
    matchHistory: null,
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
  const [hardMode, setHardMode] = useState(false);

  const setDefault = () => {
    setWinner('');
    setScore({ player1: 0, player2: 0 });
    setTrainMode(false);
    setHardMode(false);
    setGamePaused(false);
    setDefaultBallSpeed();
    paddle1Y = DEFAULT_PADDLE_POSITION;
    paddle2Y = DEFAULT_PADDLE_POSITION;
  };
  console.log(hardMode);

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
    if (hardMode) {
      util.makeRectangleShape(
        canvasContext,
        obstacleRightTopX,
        obstacleRightTopY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'rgba(37, 120, 204, 0.5)'
      ); // bonus right top obstacle
      util.makeRectangleShape(
        canvasContext,
        obstacleRightBottomX,
        obstacleRightBottomY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'rgba(37, 120, 204, 0.5)'
      ); // bonus right bottom obstacle
      util.makeRectangleShape(
        canvasContext,
        obstacleLeftBottomX,
        obstacleLeftBottomY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'rgba(37, 120, 204, 0.5)'
      ); // bonus left bottom obstacle
      util.makeRectangleShape(
        canvasContext,
        obstacleLeftTopX,
        obstacleLeftTopY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        'rgba(37, 120, 204, 0.5)'
      ); // bonus left top obstacle
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
  };

  const computerAI = () => {
    if (trainMode) {
      let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;

      if (paddle2YCenter < ballPosition.Y - 40) {
        paddle2Y += 14;
      } else if (paddle2YCenter < ballPosition.Y + 40 && paddle2Y > 0) {
        paddle2Y -= 14;
      } else if (paddle2Y <= 0) {
        paddle2Y = 10;
      } else {
        paddle2Y = paddle2Y;
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

    if (hardMode) {
      // Bounce the ball from the bottom obstacles --->
      if (
        ((ballPosition.X === obstacleLeftBottomX - BALL_RADIUS ||
          ballPosition.X ===
            obstacleLeftBottomX + PADDLE_WIDTH + BALL_RADIUS) &&
          ballPosition.Y >= obstacleLeftBottomY - BALL_RADIUS) ||
        ((ballPosition.X ===
          obstacleRightBottomX + PADDLE_WIDTH + BALL_RADIUS ||
          ballPosition.X === obstacleRightBottomX - BALL_RADIUS) &&
          ballPosition.Y >= obstacleRightBottomY - BALL_RADIUS)
      ) {
        ballSpeed.X = -ballSpeed.X;
        let deltaY = ballPosition.Y - (obstacleLeftBottomY + PADDLE_HEIGHT / 2);
        ballSpeed.Y = util.roundToTen(deltaY * 0.35);
      }
      // from up rib
      if (
        (ballPosition.X <= obstacleLeftBottomX + PADDLE_WIDTH + BALL_RADIUS &&
          ballPosition.X >= obstacleLeftBottomX - BALL_RADIUS &&
          ballPosition.Y === obstacleLeftBottomY - BALL_RADIUS) ||
        (ballPosition.X <= obstacleRightBottomX + PADDLE_WIDTH + BALL_RADIUS &&
          ballPosition.X >= obstacleRightBottomX - BALL_RADIUS &&
          ballPosition.Y === obstacleRightBottomY - BALL_RADIUS)
      ) {
        ballSpeed.Y = -ballSpeed.Y;
      }
      // Bounce the ball from the top obstacles --->
      if (
        ((ballPosition.X === obstacleRightTopX + PADDLE_WIDTH + BALL_RADIUS ||
          ballPosition.X === obstacleRightTopX - BALL_RADIUS) &&
          ballPosition.Y <= obstacleRightTopY + PADDLE_HEIGHT + BALL_RADIUS) ||
        ((ballPosition.X === obstacleLeftTopX - BALL_RADIUS ||
          ballPosition.X === obstacleLeftTopX + PADDLE_WIDTH + BALL_RADIUS) &&
          ballPosition.Y <= obstacleLeftTopY + PADDLE_HEIGHT + BALL_RADIUS)
      ) {
        ballSpeed.X = -ballSpeed.X;
        let deltaY = ballPosition.Y - (obstacleRightTopY + PADDLE_HEIGHT / 2);
        ballSpeed.Y = util.roundToTen(deltaY * 0.35);
      }
      if (
        (ballPosition.X <= obstacleRightTopX + PADDLE_WIDTH + BALL_RADIUS &&
          ballPosition.X >= obstacleRightTopX - BALL_RADIUS &&
          ballPosition.Y === obstacleRightTopY + PADDLE_HEIGHT + BALL_RADIUS) ||
        (ballPosition.X <= obstacleLeftTopX + PADDLE_WIDTH + BALL_RADIUS &&
          ballPosition.X >= obstacleLeftTopX - BALL_RADIUS &&
          ballPosition.Y === obstacleLeftTopY + PADDLE_HEIGHT + BALL_RADIUS)
      ) {
        ballSpeed.Y = -ballSpeed.Y;
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
  }, [score.player1, score.player2, gamePaused, gameOn, hardMode]);

  return (
    <div className={styles.canvasBlock}>
      <GameBar
        setTrainMode={setTrainMode}
        setScore={setScore}
        gameOn={gameOn}
        setGameOn={setGameOn}
        gamePaused={gamePaused}
        setGamePaused={setGamePaused}
        hardMode={hardMode}
        setHardMode={setHardMode}
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
