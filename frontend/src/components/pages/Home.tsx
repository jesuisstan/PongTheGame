import { useNavigate } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './Pages.module.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.centeredCard}>
      <div className={styles.homeWrapper}>
        <div style={{ marginTop: '21px' }}>
          <h5>Why?</h5>
          <p>Thanks to this website, you will play Ping-Pong with others</p>
        </div>
        {/*<div className={styles.left}>Not found</div>*/}
        <div className={styles.right}>
          <h5>Welcome!</h5>
          <p>To Pong-The-Game</p>
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
