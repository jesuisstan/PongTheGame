import DeviderPong from '../UI/DeviderPong';
import styles from './styles/Login.module.css';

const URL_AUTH_42 = `${process.env.REACT_APP_URL_BACKEND}/auth/42`;
const URL_AUTH_GITHUB = `${process.env.REACT_APP_URL_BACKEND}/auth/github`;

const Login = () => {
  const ecole42Auth = () => {
    localStorage.setItem('logStatus', 'true');
    window.location.href = URL_AUTH_42;
  };

  const githubAuth = () => {
    localStorage.setItem('logStatus', 'true');
    window.location.href = URL_AUTH_GITHUB;
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.wrapper}>
        <div className={styles.left}>Choose your Login Method</div>
        <DeviderPong />
        <div className={styles.right}>
          <div className={styles.loginButtonGithub} onClick={githubAuth}>
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
