import { useRef, useEffect, useContext, useState } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Player_game, Props_game, Game_status } from './game.interface';
import { drawState } from './utils/gameUtils';
import ScoreBar from './ScoreBar';
import styles from './styles/Game.module.css';

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 800;

function Pong(props: Props_game) {
  const socket = useContext(WebSocketContext);
  const [time, set_time] = useState(300);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, set_players] = useState<Player_game[]>(
    props.spectator || !props.players ? [] : [...props.players]
  );

  const state_ref = useRef(false);

  function on_key_release(event: KeyboardEvent) {
    on_key(event, 'release');
  }

  function on_key_press(event: KeyboardEvent) {
    on_key(event, 'press');
  }

  function on_key(event: KeyboardEvent, action: string) {
    switch (event.key) {
      case 'ArrowUp':
        socket.emit('match_game_input', { action: action, direction: 'up' });
        break;
      case 'ArrowDown':
        socket.emit('match_game_input', { action: action, direction: 'down' });
        break;
    }
  }

  const foo1 = () => {
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
      set_time(args.gameInfos.time);
      drawState(args, canvasRef);
      if (args.status === 'ended') {
        props.setGameState(Game_status.ENDED);
        // TODO clear the canvas for reprint the lobby
        console.log('Game_finished');
      }
    });
  };

  const foo2 = () => {
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
      window.addEventListener('keydown', on_key_press);
      window.addEventListener('keyup', on_key_release);

      const intervalId = setInterval(() => {
        foo1();
        foo2();
      }, 1000 / 30);

      return () => {
        clearInterval(intervalId);
        //window.removeEventListener('keydown', on_key_press);
        //window.removeEventListener('keyup', on_key_release);
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
}

export default Pong;
