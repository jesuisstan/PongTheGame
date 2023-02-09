import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ButtonPong from '../UI/ButtonPong';
import styles from './Login.module.css';

const Login = ({ user }: any) => {
  const navigate = useNavigate();

  const ecole42Auth = () => {
    window.location.href = 'http://localhost:3080/auth/42';
  };

  const github = () => {
    window.location.href = 'http://localhost:3080/auth/github';
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.wrapper}>
        <div className={styles.left}>Choose your Login Method</div>
        <div className={styles.center}>
          <div className={styles.line} />
        </div>
        <div className={styles.right}>
          <div className={styles.loginButtonGithub} onClick={github}>
            <img
              src={require('../../assets/github.png')}
              alt=""
              className={styles.icon}
            />
            Github
          </div>
          <div className={styles.loginButtonEcole} onClick={ecole42Auth}>
            <img
              src={require('../../assets/ecole42.png')}
              alt=""
              className={styles.icon}
            />
            École 42
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
