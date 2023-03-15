import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from './PleaseLogin';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import styles from './Pages.module.css';

const PlayerPage = () => {
  const { user, setUser } = useContext(UserContext);
  let { playerId } = useParams();

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className={styles.basicCard}>
      <div className={styles.playerCard}>
        <div className={styles.pcLeft}>
          <Avatar alt="" src={user.avatar} sx={{ width: 150, height: 150 }} />
          <div>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Player:
            </Typography>
            <Typography>{user.username}</Typography>
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

          <Typography component="legend">RatingRatingRatingRatingRating</Typography>
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
