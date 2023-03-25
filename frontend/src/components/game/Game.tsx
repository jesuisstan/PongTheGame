import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import styles from './styles/Game.module.css';
import Lobby from './Lobby';
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
  const [gameState, setGameState] = useState(Game_status.LOBBY);
  const [players, set_players] = useState<Game_player[]>([]);
  const [open, setOpen] = useState(false);

  socket.on('matchmaking', (args) => {
    setGameState(Game_status.BEGIN_GAME);
  });

  // const { send_message } = socket.emit()
  const joinQueue = (): void => {
    setGameState(Game_status.QUEUE);
    socket.emit('match_making', { action: 'join' });
  };

  const launchTraining = (): void => {
    setGameState(Game_status.PLAYING);
    socket.emit('match_training', {});
  };

  const joinMatch = (player1: Player_info, player2: Player_info) => {
    set_players([
      { infos: player1, score: 0 },
      { infos: player2, score: 0 }
    ]);
    setGameState(Game_status.PLAYING);
  };

  socket.on('match_result', (args) => {
    setResult(args);
  });

  const endMatch = () => {
    setGameState(Game_status.LOBBY);
  };

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.canvasBlock}>
        {gameState === Game_status.LOBBY && (
          <Lobby joinQueue={joinQueue} launchTraining={launchTraining} />
        )}
        {gameState === Game_status.ENDED && (
          <VictoryModal
            open={!open}
            setOpen={setOpen}
            gameResult={result}
            setGameState={setGameState}
          />
        )}
        {gameState === Game_status.QUEUE && (
          <Queue set_game_state={setGameState} joinMatch={joinMatch} />
        )}
        {gameState === Game_status.BEGIN_GAME && (
          <Start_game players={players} set_game_state={setGameState} />
        )}
        {gameState === Game_status.PLAYING && (
          <Pong
            spectator={false}
            players={players}
            setGameState={setGameState}
            endMatch={endMatch}
          />
        )}
        {gameState === Game_status.SPECTATE && (
          <Pong
            spectator={true}
            setGameState={setGameState}
            endMatch={endMatch}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
