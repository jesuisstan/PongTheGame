import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import PleaseLogin from '../PleaseLogin';
import NotFound from '../NotFound';
import InfoBlock from './InfoBlock';
import FriendsBlock from './FriendsBlock';
import AchievementsBlock from './AchievementsBlock';
import MatchHistoryBlock from './MatchHistoryBlock';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import { Player } from '../../../types/Player';
import styles from './PlayerCard.module.css';

const PlayerCard = () => {
  const { user } = useContext(UserContext);
  const [player, setPlayer] = useState<Player>({
    avatar: undefined,
    id: -1,
    nickname: '',
    profileId: '',
    provider: '',
    role: '',
    username: ''
  });

  let { playerNickname } = useParams();

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
  }, []);

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
        <FriendsBlock player={player} />
        <AchievementsBlock player={player} />
        <MatchHistoryBlock player={player} />
      </div>
    </div>
  );
};

export default PlayerCard;