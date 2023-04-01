import { useNavigate } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as color from '../UI/colorsPong';
import styles from './Pages.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.basicHome}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className={styles.welcome}>
          W E L C O M E
          <div style={{ fontSize: '60px', color: color.PONG_PINK }}>
            to pong-the-game
          </div>
        </div>
        <div>
          <ButtonPong
            text="Start"
            onClick={() => navigate('/login')}
            endIcon={<ArrowForwardIosIcon />}
          />
        </div>
        <div className={styles.why}>
          W H Y ?
          <div style={{ fontSize: '40px', color: color.PONG_WHITE }}>
            to play Ping-Pong with others
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
