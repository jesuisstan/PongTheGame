import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import Lobby from './Lobby';
import Pong from './Pong';
import QueueModal from './QueueModal';
import VictoryModal from './VictoryModal';
import CountdownModal from './CountdownModal';
import {
  CurrentGamePlayer,
  GameResult,
  GameStatus,
  PlayerData
} from './game.interface';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { GameStateContext } from '../../contexts/GameStateContext';
import styles from './styles/Game.module.css';

const Game = () => {
  const socket = useContext(WebSocketContext);
  const { user } = useContext(UserContext);
  const [result, setResult] = useState<GameResult | null>(null);
  const { gameState, setGameState } = useContext(GameStateContext);
  const [players, setPlayers] = useState<CurrentGamePlayer[]>([]);
  const [openVictoryModal, setOpenVictoryModal] = useState(false);
  const [openCount, setOpenCount] = useState(false);
  const [openQueueModal, setOpenQueueModal] = useState(false);

  if (user.provider && user.nickname) {
    socket.on('matchmaking', (args) => {
      setGameState(GameStatus.BEGIN_GAME);
    });

    socket.on('match_result', (args) => {
      setResult(args);
    });
  }

  socket.on('match_spectate', (args) => {
    if (args.status && args.status === 'success')
      setGameState(GameStatus.SPECTATE);
  });

  socket.on('match_custom_start', (args) => {
    setGameState(GameStatus.BEGIN_GAME);
  });

  const joinQueue = (): void => {
    setGameState(GameStatus.QUEUE);
    socket.emit('match_making', { action: 'join' });
  };

  const launchTraining = (): void => {
    setGameState(GameStatus.PLAYING);
    socket.emit('match_training', {});
  };

  //todo get rid of joinMatch???
  const joinMatch = (player1: PlayerData, player2: PlayerData) => {
    setPlayers([
      { infos: player1, score: 0 },
      { infos: player2, score: 0 }
    ]);
    setGameState(GameStatus.PLAYING);
  };

  const endMatch = () => {
    setGameState(GameStatus.LOBBY);
  };

  return !user.provider || (user.provider && !user.nickname) ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.canvasBlock}>
        {gameState === GameStatus.LOBBY && (
          <Lobby joinQueue={joinQueue} launchTraining={launchTraining} />
        )}
        {gameState === GameStatus.ENDED && (
          <VictoryModal
            open={!openVictoryModal}
            setOpen={setOpenVictoryModal}
            gameResult={result}
          />
        )}
        {gameState === GameStatus.QUEUE && (
          <QueueModal open={!openQueueModal} setOpen={setOpenQueueModal} />
        )}
        {gameState === GameStatus.BEGIN_GAME && (
          <CountdownModal
            open={!openCount}
            setOpen={setOpenCount}
            seconds={5}
          />
        )}
        {gameState === GameStatus.PLAYING && (
          <Pong spectator={false} players={players} setEndMatch={endMatch} />
        )}
        {gameState === GameStatus.SPECTATE && (
          <Pong spectator={true} setEndMatch={endMatch} />
        )}
      </div>
    </div>
  );
};

export default Game;
