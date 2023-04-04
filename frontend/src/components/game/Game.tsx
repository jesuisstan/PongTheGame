import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import Lobby from './Lobby';
import Pong from './Pong';
import QueueModal from './QueueModal';
import VictoryModal from './VictoryModal';
import CountdownModal from './CountdownModal';
import {
  Game_player,
  Game_result,
  Game_status,
  Player_info
} from './game.interface';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { GameStateContext } from '../../contexts/GameStateContext';
import styles from './styles/Game.module.css';

const Game = () => {
  const socket = useContext(WebSocketContext);
  const { user } = useContext(UserContext);
  const [result, setResult] = useState<Game_result | null>(null);
  const { gameState, setGameState } = useContext(GameStateContext);

  const [players, set_players] = useState<Game_player[]>([]);
  const [openVictoryModal, setOpenVictoryModal] = useState(false);
  const [openCount, setOpenCount] = useState(false);
  const [openQueueModal, setOpenQueueModal] = useState(false);

  if (user.provider && user.nickname) {
    socket.on('matchmaking', (args) => {
      setGameState(Game_status.BEGIN_GAME);
    });

    socket.on('match_result', (args) => {
      setResult(args);
    });
  }

  socket.on('match_spectate', (args) => {
    if (args.status && args.status === 'success')
      setGameState(Game_status.SPECTATE);
  });

  socket.on('match_custom_start', (args) => {
    setGameState(Game_status.BEGIN_GAME);
  });

  const joinQueue = (): void => {
    setGameState(Game_status.QUEUE);
    socket.emit('match_making', { action: 'join' });
  };

  const launchTraining = (): void => {
    setGameState(Game_status.PLAYING);
    socket.emit('match_training', {});
  };

  //todo get rid of joinMatch???
  const joinMatch = (player1: Player_info, player2: Player_info) => {
    set_players([
      { infos: player1, score: 0 },
      { infos: player2, score: 0 }
    ]);
    setGameState(Game_status.PLAYING);
  };

  const endMatch = () => {
    setGameState(Game_status.LOBBY);
  };

  return !user.provider || (user.provider && !user.nickname) ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.canvasBlock}>
        {gameState === Game_status.LOBBY && (
          <Lobby joinQueue={joinQueue} launchTraining={launchTraining} />
        )}
        {gameState === Game_status.ENDED && (
          <VictoryModal
            open={!openVictoryModal}
            setOpen={setOpenVictoryModal}
            gameResult={result}
          />
        )}
        {gameState === Game_status.QUEUE && (
          <QueueModal open={!openQueueModal} setOpen={setOpenQueueModal} />
        )}
        {gameState === Game_status.BEGIN_GAME && (
          <CountdownModal
            open={!openCount}
            setOpen={setOpenCount}
            players={players}
            seconds={5}
          />
        )}
        {gameState === Game_status.PLAYING && (
          <Pong spectator={false} players={players} setEndMatch={endMatch} />
        )}
        {gameState === Game_status.SPECTATE && (
          <Pong spectator={true} setEndMatch={endMatch} />
        )}
      </div>
    </div>
  );
};

export default Game;
