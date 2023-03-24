import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import styles from './Game.module.css';
import Pong from './Pong';
import {
  Game_player,
  Game_result,
  Game_status,
  Player_info
} from './game.interface';
import ButtonPong from '../UI/ButtonPong';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import Start_game from './Start_game';
import Queue from './Queue';
import VictoryModal from './VictoryModal';

const Game = () => {
  const socket = useContext(WebSocketContext);

  const { user, setUser } = useContext(UserContext);
  const state_ref = useRef(Game_status.LOBBY);
  const [result, setResult] = useState<Game_result | null>(null);
  const [game_state, set_game_state] = useState(Game_status.LOBBY);
  const [players, set_players] = useState<Game_player[]>([]);
  const [open, setOpen] = useState(false);

  socket.on('matchmaking', (args) => {
    set_game_state(Game_status.BEGIN_GAME);
    console.log({ args });
  });

  // const { send_message } = socket.emit()
  function join_queu() {
    set_game_state(Game_status.QUEUE);
    socket.emit('match_making', { action: 'join' });
  }

  function join_match(player1: Player_info, player2: Player_info) {
    set_players([
      { infos: player1, score: 0 },
      { infos: player2, score: 0 }
    ]);
    set_game_state(Game_status.PLAYING);
  }

  useEffect(() => {
    state_ref.current = game_state;
  }, [game_state]);

  socket.on('match_result', (args) => {
    setResult(args);
  });

  function endMatch() {
    set_game_state(Game_status.LOBBY);
  }

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.canvasBlock}>
        {game_state === Game_status.LOBBY && (
          <ButtonPong
            text="test pong"
            onClick={() => {
              join_queu();
            }}
          />
        )}
        {game_state === Game_status.ENDED && (
          <VictoryModal
            open={!open}
            setOpen={setOpen}
            gameResult={result}
            setGameState={set_game_state}
          />
        )}
        {game_state === Game_status.QUEUE && (
          <Queue set_game_state={set_game_state} join_match={join_match} />
        )}
        {game_state === Game_status.BEGIN_GAME && (
          <Start_game players={players} set_game_state={set_game_state} />
        )}
        {game_state === Game_status.PLAYING && (
          <Pong
            spectator={false}
            players={players}
            set_game_state={set_game_state}
            endMatch={endMatch}
          />
        )}
        {game_state === Game_status.SPECTATE && (
          <Pong
            spectator={true}
            set_game_state={set_game_state}
            endMatch={endMatch}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
