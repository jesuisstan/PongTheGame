import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './styles/Home.module.css';
import '../../App.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className={styles.basicHome}>
      <div className={styles.welcome}>
        <div style={{ letterSpacing: '0.25em' }}>WELCOME</div>
        <div style={{ fontSize: '50px' }}>to Pong The Game</div>
        <div>
          <ButtonPong
            text={user.provider ? 'Continue' : 'Start'}
            onClick={() => navigate('/login')}
            endIcon={<ArrowForwardIosIcon />}
            inversedColors
          />
        </div>
      </div>
      <div className={styles.why}>
        <div style={{ letterSpacing: '0.25em' }}>WHY?</div>
        <div style={{ fontSize: '30px' }}>to play Ping-Pong with others</div>
      </div>
    </div>
  );
};

export default Home;