import { useRef, useEffect, useContext, useState } from 'react';
import { GameStatusContext } from '../../contexts/GameStatusContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { CurrentGamePlayer, GameProps, GameStatus } from './game.interface';
import { drawState } from './utils/gameUtils';
import ScoreBar from './ScoreBar';
import styles from './styles/Game.module.css';

const Pong = (props: GameProps) => {
  const { setGameStatus } = useContext(GameStatusContext);
  const socket = useContext(WebSocketContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [winScore, setwinScore] = useState<number>(5);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [players, setPlayers] = useState<CurrentGamePlayer[]>(
    props.spectator || !props.players ? [] : [...props.players]
  );

  const onKeyRelease = (event: KeyboardEvent) => {
    keyHandler(event, 'release');
  };

  const onKeyPress = (event: KeyboardEvent) => {
    keyHandler(event, 'press');
  };
  const onKeyReleaseRef = useRef(onKeyRelease);
  const onKeyPressRef = useRef(onKeyPress);

  const keyHandler = (event: KeyboardEvent, action: string) => {
    switch (event.key) {
      case 'ArrowUp':
        socket.emit('match_game_input', { action: action, direction: 'up' });
        break;
      case 'ArrowDown':
        socket.emit('match_game_input', { action: action, direction: 'down' });
        break;
    }
  };

  const expandTheGame = (args: any) => {
    if (players.length === 0) {
      setPlayers([
        {
          ...players[0],
          infos: args.player1.infos,
          score: args.player1.score
        },
        {
          ...players[1],
          infos: args.player2.infos,
          score: args.player2.score
        }
      ]);
      setwinScore(args.gameInfos.winScore);
      setCanvasSize({
        ...canvasSize,
        width: args.gameInfos.originalWidth,
        height: args.gameInfos.originalHeight
      });
    }
    drawState(args, canvasRef);
  };

  useEffect(() => {
    if (props.spectator) {
      return () => {
        socket.emit('match_spectate_leave', {});
      };
    }

    const intervalId = setInterval(() => {
      const playPong = () => {
        socket.on('match_game_state', (args) => {
          expandTheGame(args);
          window.addEventListener('keydown', onKeyPressRef.current);
          window.addEventListener('keyup', onKeyReleaseRef.current);

          if (args.status === 'ended' || args.status === 'aborted') {
            setGameStatus(GameStatus.ENDED);
            window.removeEventListener('keydown', onKeyPressRef.current);
            window.removeEventListener('keyup', onKeyReleaseRef.current);
          }
        });
      };

      playPong();

      const spectatePong = () => {
        socket.on('match_spectate_state', (args) => {
          console.log(args);
          console.log('spectating Pong');
          expandTheGame(args);
          if (args.status === 'ended' || args.status === 'aborted') {
            setGameStatus(GameStatus.ENDED);
          }
        });
      };

      spectatePong();
    }, 1000 / 30);

    return () => {
      clearInterval(intervalId);
    };
  }, [players, socket]);

  return (
    <div className={styles.canvasBlock}>
      {players.length > 0 && (
        <ScoreBar winScore={winScore} players={players}></ScoreBar>
      )}
      <canvas
        className={styles.canvas}
        id="test"
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
    </div>
  );
};

export default Pong;
