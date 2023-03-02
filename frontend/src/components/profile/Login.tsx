import styles from './Login.module.css';

const URL_AUTH_42 =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_AUTH_42);
const URL_AUTH_GITHUB =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_AUTH_GITHUB);

const Login = () => {
  const ecole42Auth = () => {
    window.location.href = URL_AUTH_42;
  };

  const githubAuth = () => {
    window.location.href = URL_AUTH_GITHUB;
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.wrapper}>
        <div className={styles.left}>Choose your Login Method</div>
        <div className={styles.center}>
          <div className={styles.line} />
        </div>
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
