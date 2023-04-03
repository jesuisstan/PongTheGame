import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Player } from '../../types/Player';
import PleaseLogin from '../pages/PleaseLogin';
import NotFound from '../pages/NotFound';
import InfoBlock from './InfoBlock';
import FriendsBlock from './friends/FriendsBlock';
import AchievementsBlock from './achievements/AchievementsBlock';
import MatchHistoryBlock from './match_history/MatchHistoryBlock';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Divider from '@mui/material/Divider';
import styles from './styles/PlayerCard.module.css';

const PlayerCard = () => {
  const socket = useContext(WebSocketContext);
  const [socketEvent, setSocketEvent] = useState(0);
  const { user } = useContext(UserContext);
  const [player, setPlayer] = useState<Player>({
    avatar: undefined,
    id: -1,
    nickname: '',
    profileId: '',
    provider: '',
    role: '',
    status: 'OFFLINE',
    username: ''
  });

  let { playerNickname } = useParams();

  socket.on('user_status', (args) => {
    setSocketEvent((prev) => prev + 1);
  });

  useEffect(() => {
    backendAPI.get(`/user/${playerNickname}`).then(
      (response) => {
        setPlayer(response.data);
      },
      (error) => {
        if (error.response?.status === 404) {
          errorAlert('Player with such a nickname was not found');
        } else {
          errorAlert('Something went wrong');
        }
      }
    );
  }, [playerNickname, socketEvent]);

  return !user.provider ? (
    <PleaseLogin />
  ) : player.id === -1 ? (
    <NotFound />
  ) : (
    <div className={styles.basicCard}>
      <div className={styles.header}>
        <h5>Player statistics</h5>
      </div>
      <div className={styles.playerCard}>
        <InfoBlock player={player} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: 'rgba(245, 245, 245, 0.3)' }}
        />
        <FriendsBlock player={player} socketEvent={socketEvent} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: 'rgba(245, 245, 245, 0.3)' }}
        />
        <AchievementsBlock player={player} socketEvent={socketEvent} />
        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: 'rgba(245, 245, 245, 0.3)' }}
        />
        <MatchHistoryBlock player={player} socketEvent={socketEvent} />
      </div>
    </div>
  );
};

export default PlayerCard;
