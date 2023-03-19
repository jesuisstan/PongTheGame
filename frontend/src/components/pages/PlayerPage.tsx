import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from './PleaseLogin';
import NotFound from './NotFound';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import ButtonPong from '../UI/ButtonPong';
import { Player } from '../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './Pages.module.css';

const PlayerPage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
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

  let { playerNickname } = useParams();

  useEffect(() => {
    backendAPI.get(`/user/${playerNickname}`).then(
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
      <div style={{ marginTop: '21px', marginBottom: '21px' }}>
        <h5>Player statistics</h5>
      </div>
      <div className={styles.playerCard}>
        <div className={styles.pcLeft}>
          <Avatar
            src={player.avatar}
            alt=""
            variant="rounded"
            sx={{ width: 200, height: 200 }}
          />
          <div>
            <Typography
              textColor="rgb(37, 120, 204)"
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
              textColor="rgb(37, 120, 204)"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Nickname:
            </Typography>
            <Typography>{player.nickname}</Typography>
          </div>
          <ButtonPong
            text="Back"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosIcon />}
          />
        </div>
        <div>
          <Typography
            textColor="rgb(37, 120, 204)"
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
        </div>
        <div>
          <Typography
            textColor="rgb(37, 120, 204)"
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Match history
          </Typography>
          <Typography component="legend">Games played: {0}</Typography>
          <Typography
            mt={2}
            level="h1"
            textColor="rgb(37, 120, 204)"
            fontWeight="lg"
            textAlign="left"
          >
            Including:
          </Typography>
          <Typography textAlign="left" component="legend">
            Wins: {0}
          </Typography>
          <Typography textAlign="left" component="legend">
            Draws: {0}
          </Typography>
          <Typography textAlign="left" component="legend">
            Loses: {0}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
