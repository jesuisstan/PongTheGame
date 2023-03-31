import { useNavigate } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './Pages.module.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.basicHome}>
      <div className={styles.centeredCard}>
        <div className={styles.welcome}>
          <h5>Welcome!</h5>
          <p>To Pong-The-Game</p>
          <h5>Why?</h5>
          <p>Thanks to this website, you will play Ping-Pong with others</p>
          <ButtonPong
            text="Start"
            onClick={() => navigate('/login')}
            endIcon={<ArrowForwardIosIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
