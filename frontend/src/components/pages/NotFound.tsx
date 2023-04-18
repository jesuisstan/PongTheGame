import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarLoader from 'react-spinners/BarLoader';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonPong from '../UI/ButtonPong';
import DeviderPong from '../UI/DeviderPong';
import styles from './styles/Pages.module.css';

const NotFound = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return loading ? (
    <div className={styles.loadSpinner}>
      <p>loading...</p>
      <BarLoader
        color="black"
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <div className={styles.centeredCard}>
      <div className={styles.wrapper}>
        <div className={styles.left}>Not found</div>
        <DeviderPong />
        <div className={styles.right}>
          <ButtonPong
            text="Back"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosIcon />}
          />
          <ButtonPong
            text="Home"
            onClick={() => navigate('/')}
            endIcon={<ArrowForwardIosIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
