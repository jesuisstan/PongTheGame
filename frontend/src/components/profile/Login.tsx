import styles from './Login.module.css';

const Login = () => {
  const google = () => {
    window.open('http://localhost:3080/auth/google', '_self');
  };

  const ecole42Auth = () => {
    window.open('http://localhost:3080/auth/42', '_self');
  };

  const github = () => {
    window.open('http://localhost:3080/auth/github', '_self');
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
            Ecole 42
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
