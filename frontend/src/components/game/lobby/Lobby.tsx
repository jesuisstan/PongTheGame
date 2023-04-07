import ButtonPong from '../../UI/ButtonPong';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import LobbySearchBar from './LobbySearchBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeviderPong from '../../UI/DeviderPong';
import * as color from '../../UI/colorsPong';
import * as MUI from '../../UI/MUIstyles';
import styles from './Lobby.module.css';

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
      <div className={styles.lobbyCard}>
        <Box sx={MUI.boxStyle}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Single mode
          </Typography>
          <Avatar
            src={require('../../../assets/singlePlay.jpg')}
            alt=""
            variant="rounded"
            sx={{ width: 100, height: 100 }}
          />
          <Typography>Practise with artificial intelligence</Typography>
          <div>
            <ButtonPong
              text="Train"
              title="Play with Artificial Intelligence"
              onClick={launchTraining}
              endIcon={<SmartToyIcon />}
            />
          </div>
        </Box>

        <DeviderPong />

        <Box sx={MUI.boxStyle}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Random game
          </Typography>
          <Avatar
            src={require('../../../assets/randomGame.jpg')}
            alt=""
            variant="rounded"
            sx={{ width: 100, height: 100 }}
          />
          <Typography>
            Play classic Ping-Pong with random online player
          </Typography>
          <div>
            <ButtonPong
              text="Play"
              title="Play online with random user"
              onClick={joinQueue}
              endIcon={<SportsEsportsIcon />}
            />
          </div>
        </Box>

        <DeviderPong />

        <Box sx={MUI.boxStyle}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Custom game
          </Typography>
          <Avatar
            src={require('../../../assets/customGame.jpg')}
            alt=""
            variant="rounded"
            sx={{ width: 100, height: 100 }}
          />
          <Typography>
            Invite any player to join your customised game
          </Typography>
          <LobbySearchBar />
        </Box>

        <DeviderPong />

        <Box sx={MUI.boxStyle}>
          <Typography
            textColor={color.PONG_ORANGE}
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Statistics
          </Typography>
          <Avatar
            src={require('../../../assets/trophy.jpg')}
            alt=""
            variant="rounded"
            sx={{ width: 100, height: 100 }}
          />
          <Typography>Check your results and achievements</Typography>
          <div>
            <ButtonPong
              text="Stats"
              title="Go to player profile"
              onClick={() => navigate(`/players/${user.nickname}`)}
              endIcon={<ArrowForwardIosIcon />}
            />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default Lobby;
