import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import BarLoader from 'react-spinners/BarLoader';
import EditNickname from '../profile/EditNickname';
import ButtonPong from '../UI/ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './Pages.module.css';

const PleaseLogin = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2200);
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
  ) : !user.nickname && user.provider ? (
    <EditNickname open={!open} setOpen={setOpen} />
  ) : (
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
