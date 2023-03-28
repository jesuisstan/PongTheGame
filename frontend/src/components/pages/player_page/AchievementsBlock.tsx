import { useEffect, useState } from 'react';
import AchievementsListModal from './AchievementsListModal';
import ButtonPong from '../../UI/ButtonPong';
import { Player } from '../../../types/Player';
import { Achievement } from '../../../types/Achievement';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from './PlayerCard.module.css';

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
      {achievements.map((item) => (
        <Typography
          key={item.id}
          title={item.Description}
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
      <div style={{ marginTop: '21px' }}>
        <ButtonPong
          text="possible"
          title={'Show all possible achievements'}
          onClick={() => setOpen(true)}
          endIcon={<VisibilityIcon />}
        />
        <AchievementsListModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default AchievementsBlock;