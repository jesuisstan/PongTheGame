import { useNavigate } from 'react-router-dom';
import ButtonPong from '../../UI/ButtonPong';
import { Player } from '../../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './PlayerCard.module.css';

const InfoBlock = ({ player }: { player: Player }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.basicInfoBlock}>
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
  );
};

export default InfoBlock;
