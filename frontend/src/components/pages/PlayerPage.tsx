import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from './PleaseLogin';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import NotFound from './NotFound';
import { Player } from '../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import styles from './Pages.module.css';

const PlayerPage = () => {
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

  let { playerId } = useParams();

  useEffect(() => {
    backendAPI.get(`/user/${playerId}`).then(
      (response) => {
        setPlayer(response.data);
      },
      (error) => {
        if (error.response?.status === 404) {
          errorAlert('Player with such nickname was not found');
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
      <div className={styles.playerCard}>
        <div className={styles.pcLeft}>
          <Avatar alt="" src={player.avatar} sx={{ width: 200, height: 200 }} />
          <div>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Player:
            </Typography>
            <Typography>{player.username}</Typography>
          </div>
          <div>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Nickname:
            </Typography>
            <Typography>{playerId}</Typography>
          </div>
        </div>
        <div className={styles.pcRight}>
          <Typography
            id="basic-list-demo"
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Achievements
          </Typography>
          <Typography component="legend">Rating</Typography>

          <Typography component="legend">
            RatingRatingRatingRatingRating
          </Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>
          <Typography component="legend">Rating</Typography>

          <Rating name="read-only" value={4} readOnly />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
