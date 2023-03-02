import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonPong from '../UI/ButtonPong';
import styles from './OtherPages.module.css';

const PleaseLogin = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.centeredCard}>
      <div className={styles.wrapper}>
        <div className={styles.left}>Please login to continue</div>
        <div className={styles.center}>
          <div className={styles.line} />
        </div>
        <div className={styles.right}>
          <ButtonPong
            text="Back"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosIcon />}
          />
          <ButtonPong
            text="Login"
            onClick={() => navigate('/login')}
            endIcon={<ArrowForwardIosIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default PleaseLogin;
