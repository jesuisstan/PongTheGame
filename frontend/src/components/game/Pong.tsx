import { useRef, useEffect, useContext, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Player_game, Props_game, Game_status } from './game.interface';
import { drawState } from './utils/gameUtils';
import ScoreBar from './ScoreBar';
import styles from './styles/Game.module.css';

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 800;

const Pong = (props: Props_game) => {
  const socket = useContext(WebSocketContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, set_players] = useState<Player_game[]>(
    props.spectator || !props.players ? [] : [...props.players]
  );

  const state_ref = useRef(false);

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

  const playPong = () => {
    socket.on('match_game_state', (args) => {
      // if (props.spectator) {
      // For specator mode need to check the current He need to be false for the player1 and player 2
      if (players.length == 0) {
        set_players([
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
      }

      window.addEventListener('keydown', onKeyPressRef.current);
      window.addEventListener('keyup', onKeyReleaseRef.current);

      drawState(args, canvasRef);
      if (args.status === 'ended') {
        props.setGameState(Game_status.ENDED);
        // TODO clear the canvas for reprint the lobby
        console.log('Game_finished');
        window.removeEventListener('keydown', onKeyPressRef.current);
        window.removeEventListener('keyup', onKeyReleaseRef.current);
      }
    });
  };

  const checkGameAborted = () => {
    socket.on('game_aborted', (args) => {
      console.log(args.reason);
      // TODO need to clear canvas adn change alert for something else
    });
  };

  useEffect(() => {
    if (!state_ref.current) {
      state_ref.current = true;
      if (props.spectator) {
        return () => {
          socket.emit('match_spectate_leave', {});
        };
      }

      const intervalId = setInterval(() => {
        playPong();
        checkGameAborted();
      }, 1000 / 30);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [players]);

  let winScore = 5; // todo temp value. Request from server
  return (
    <div className={styles.canvasBlock}>
      {players.length > 0 && (
        <ScoreBar
          winScore={winScore}
          players={players}
          //gameOn={gameOn}
        ></ScoreBar>
      )}
      <canvas
        className={styles.canvas}
        id="test"
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  );
};

export default Pong;
