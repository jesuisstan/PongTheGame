import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import PleaseLogin from '../PleaseLogin';
import NotFound from '../NotFound';
import InfoBlock from './InfoBlock';
import AchievementsBlock from './AchievementsBlock';
import MatchHistoryBlock from './MatchHistoryBlock';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import { Player } from '../../../types/Player';
import styles from './PlayerCard.module.css';

const PlayerCard = () => {
  const { user, setUser } = useContext(UserContext);
  const [player, setPlayer] = useState<Player>({
    achievements: null,
    avatar: undefined,
    id: -1,
    matchHistory: null,
    nickname: '',
    profileId: '',
    provider: '',
    role: '',
    username: ''
  });
  const [achievements, setAchievements] = useState(
    Array<{ id: -1; Name: ''; Description: '' }>
  ); // todo temp option

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

  useEffect(() => {
    backendAPI.get(`/achievements`).then(
      (response) => {
        setAchievements(response.data);
        console.log(typeof response.data);
      },
      (error) => {
        console.log('achtung!');
      }
    );
  }, []);

  return !user.provider ? (
    <PleaseLogin />
  ) : player.id === -1 ? (
    <NotFound />
  ) : (
    <div className={styles.basicCard}>
      <div style={{ marginTop: '21px', marginBottom: '21px' }}>
        <h5>Player statistics</h5>
      </div>
      <div className={styles.playerCard}>
        <InfoBlock player={player} />
        <AchievementsBlock player={player} achievements={achievements} />
        <MatchHistoryBlock player={player} />
      </div>
    </div>
  );
};

export default PlayerCard;
