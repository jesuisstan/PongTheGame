import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import Lobby from './lobby/Lobby';
import Pong from './Pong';
import QueueModal from './QueueModal';
import CountdownModal from './CountdownModal';
import { CurrentGamePlayer, GameStatus } from './game.interface';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { GameStatusContext } from '../../contexts/GameStatusContext';
import { GameResultContext } from '../../contexts/GameResultContext';
import styles from './styles/Game.module.css';

const COUNTDOWN_SECONDS: number = 5;

const Game = () => {
  const socket = useContext(WebSocketContext);
  const { user } = useContext(UserContext);
  const { gameStatus, setGameStatus } = useContext(GameStatusContext);
  const { setGameResult } = useContext(GameResultContext);
  const [players, setPlayers] = useState<CurrentGamePlayer[]>([]);
  const [openCount, setOpenCount] = useState(false);
  const [openQueueModal, setOpenQueueModal] = useState(false);

  socket.on('matchmaking', (args) => {
    setGameStatus(GameStatus.BEGIN_GAME);
  });

  socket.on('match_result', (args) => {
    setGameResult(args);
  });

  socket.on('match_abort_during_begin', (args) => {
    setGameStatus(GameStatus.ENDED);
  });

  socket.on('match_spectate', (args) => {
    if (args.status && args.status === 'success')
      setGameStatus(GameStatus.SPECTATE);
  });

  socket.on('match_custom_start', (args) => {
    setGameStatus(GameStatus.BEGIN_GAME);
  });

  const joinQueue = (): void => {
    setGameStatus(GameStatus.QUEUE);
    socket.emit('match_making', { action: 'join' });
  };

  const launchTraining = (): void => {
    setGameStatus(GameStatus.PLAYING);
    socket.emit('match_training', {});
  };

  const endMatch = () => {
    setGameStatus(GameStatus.LOBBY);
  };

  return !user.provider || (user.provider && !user.nickname) ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.canvasBlock}>
        {gameStatus === GameStatus.LOBBY && (
          <Lobby joinQueue={joinQueue} launchTraining={launchTraining} />
        )}
        {gameStatus === GameStatus.QUEUE && (
          <QueueModal open={!openQueueModal} setOpen={setOpenQueueModal} />
        )}
        {gameStatus === GameStatus.BEGIN_GAME && (
          <CountdownModal
            open={!openCount}
            setOpen={setOpenCount}
            seconds={COUNTDOWN_SECONDS}
          />
        )}
        {gameStatus === GameStatus.PLAYING && (
          <Pong spectator={false} players={players} setEndMatch={endMatch} />
        )}
        {gameStatus === GameStatus.SPECTATE && (
          <Pong spectator={true} setEndMatch={endMatch} />
        )}
      </div>
    </div>
  );
};

export default Game;