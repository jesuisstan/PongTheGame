import { useEffect, useState } from 'react';
import AchievementsListModal from './AchievementsListModal';
import { PlayerProfile } from '../../../types/PlayerProfile';
import { Achievement } from '../../../types/Achievement';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import * as color from '../../UI/colorsPong';
import styles from '../styles/PlayerCard.module.css';

const AchievementsBlock = ({
  player,
  socketEvent
}: {
  player: PlayerProfile;
  socketEvent: number;
}) => {
  const [open, setOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    backendAPI.get(`/achievements/${player.nickname}`).then(
      (response) => {
        setAchievements(response.data.achievement);
      },
      (error) => {
        errorAlert(`Failed to get player's achievements`);
      }
    );
  }, [socketEvent, player.nickname]);

  return (
    <div className={styles.achieveBlock}>
      <Typography
        textColor={color.PONG_ORANGE}
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
      >
        Achievements
      </Typography>
      <Typography component="legend">Gained: {achievements.length}</Typography>
      <div>
        <Typography
          level="h1"
          textColor={color.PONG_ORANGE}
          fontWeight="lg"
          textAlign="left"
        >
          Including:
        </Typography>
        {achievements.map((item) => (
          <Typography
            key={item.id}
            title={item.Description}
            textAlign="left"
            sx={{
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'wait'
              }
            }}
          >
            {item.Name}
          </Typography>
        ))}
      </div>
      <div>
        <IconButton
          color="primary"
          title={'Show all possible achievements'}
          onClick={() => setOpen(true)}
        >
          <HelpOutlineIcon
            fontSize="large"
            sx={{
              color: 'black',
              '&:hover': {
                color: color.PONG_PINK
              }
            }}
          />
        </IconButton>
        <AchievementsListModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default AchievementsBlock;
