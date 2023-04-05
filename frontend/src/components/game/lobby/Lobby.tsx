import ButtonPong from '../../UI/ButtonPong';
import Divider from '@mui/material/Divider';
import styles from './Lobby.module.css';
import { UserContext } from '../../../contexts/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LobbySearchBar from './LobbySearchBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import * as color from '../../UI/colorsPong';

const VerticalDevider = (
  <Divider
    orientation="vertical"
    flexItem
    sx={{ backgroundColor: 'rgba(245, 245, 245, 0.3)' }}
  />
);

const Lobby = ({
  joinQueue,
  launchTraining
}: {
  joinQueue: () => void;
  launchTraining: () => void;
}) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className={styles.basicCard}>
      <div className={styles.header}>
        <h5>Pong The Game Lobby</h5>
      </div>
      <div className={styles.playerCard}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Single mode
          </Typography>
          <Typography>Practise with artificial intelligence</Typography>
          <div>
            <ButtonPong
              text="Train"
              title="Play with Artificial Intelligence"
              onClick={launchTraining}
            />
          </div>
        </Box>

        {VerticalDevider}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Random game
          </Typography>
          <Typography>
            Play classic Ping-Pong with random online player
          </Typography>
          <div>
            <ButtonPong
              text="Random"
              title="Play online with random user"
              onClick={joinQueue}
            />
          </div>
        </Box>

        {VerticalDevider}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Custom game
          </Typography>
          <Typography>
            Invite any player to join your customised game
          </Typography>
          <LobbySearchBar />
        </Box>

        {VerticalDevider}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Statistics
          </Typography>
          <Typography>Check your results and achievements</Typography>
          <div>
            <ButtonPong
              text="Stats"
              title="Go to player profile"
              onClick={() => navigate(`/players/${user.nickname}`)}
            />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Lobby;
