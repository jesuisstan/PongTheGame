import { useState } from 'react';
import AchievementsListModal from './AchievementsListModal';
import ButtonPong from '../../UI/ButtonPong';
import Typography from '@mui/joy/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AchievementsBlock = ({
  achievements
}: {
  achievements: Array<{ id: -1; Name: ''; Description: '' }>;
}) => {
  const [open, setOpen] = useState(false);

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
