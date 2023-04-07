import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as color from '../UI/colorsPong';
import styles from './Pages.module.css';
import '../../App.css'

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className={styles.basicHome}>
      <div
        style={{
          fontSize: '60px',
          color: color.PONG_PINK,
          paddingLeft: '280px',
          marginTop: '60px'
        }}
      >
        <div
          style={{
            borderRadius: '4px',
            textAlign: 'left'
          }}
        >
          W E L C O M E
          <div
            style={{
              fontSize: '50px',
              color: color.PONG_PINK
            }}
          >
            to Pong The Game
          </div>
        </div>
        <div
          style={{
            textAlign: 'left'
          }}
        >
          <ButtonPong
            text={user.provider ? 'Continue' : 'Start'}
            onClick={() => navigate('/login')}
            endIcon={<ArrowForwardIosIcon />}
            inversedColors
          />
        </div>
      </div>
      <div
        style={{
          fontSize: '40px',
          color: color.PONG_ORANGE,
          paddingLeft: '70px',
          marginTop: '342px',
          textAlign: 'left'
        }}
      >
        W H Y ?
        <div
          style={{
            fontSize: '30px',
            color: color.PONG_ORANGE,
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
