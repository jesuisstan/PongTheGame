import { Player } from '../../../types/Player';
import Typography from '@mui/joy/Typography';

const AchievementsBlock = ({
  player,
  achievements
}: {
  player: Player;
  achievements: Array<{ id: -1; Name: ''; Description: '' }>;
}) => {
  return (
    <div style={{ minWidth: '210px' }}>
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
              textDecoration: 'underline',
              cursor: 'wait'
            }
          }}
        >
          {item.Name}
        </Typography>
      ))}
    </div>
  );
};

export default AchievementsBlock;
