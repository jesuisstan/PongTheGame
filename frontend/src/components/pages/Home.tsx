import { useNavigate } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as color from '../UI/colorsPong';
import styles from './Pages.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.basicHome}>
      <div
        style={{
          fontSize: '70px',
          color: color.PONG_PINK,
          marginLeft: 'auto',
          marginRight: '421px',
          marginTop: '84px'
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '4px'
          }}
        >
          W E L C O M E
          <div
            style={{
              fontSize: '60px',
              color: color.PONG_WHITE
            }}
          >
            to Pong The Game
          </div>
        </div>

        <ButtonPong
          text="Start"
          onClick={() => navigate('/login')}
          endIcon={<ArrowForwardIosIcon />}
          inversedColors
        />
      </div>
      <div
        style={{
          fontSize: '50px',
          color: color.PONG_PINK,
          marginLeft: 'auto',
          marginRight: '80px',
          marginTop: '300px',
          textAlign: 'right'
        }}
      >
        W H Y ?
        <div
          style={{
            fontSize: '40px',
            color: color.PONG_WHITE,
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '4px'
          }}
        >
          to play Ping-Pong with others
        </div>
      </div>
    </div>
  );
};

export default Home;
