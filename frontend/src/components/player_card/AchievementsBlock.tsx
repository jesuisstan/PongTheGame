import { useEffect, useState } from 'react';
import AchievementsListModal from './AchievementsListModal';
import { Player } from '../../types/Player';
import { Achievement } from '../../types/Achievement';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from './styles/PlayerCard.module.css';

const AchievementsBlock = ({ player }: { player: Player }) => {
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
  }, []);

  return (
    <div className={styles.achieveBlock}>
      <Typography
        textColor="rgb(37, 120, 204)"
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
          textColor="rgb(37, 120, 204)"
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
                transform: 'scale(1.1)',
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
          <VisibilityIcon
            fontSize="large"
            sx={{
              color: 'black',
              '&:hover': {
                color: 'rgba(253, 80, 135, 0.91)'
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
