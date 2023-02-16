import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Validate2fa from './Validate2fa';
import styles from './Login.module.css';
import { useNavigate, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import errorAlert from '../UI/errorAlert';

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(String(process.env.REACT_APP_URL_AUTH), { withCredentials: true })
      .then(
        (response) => {
          if (response.data.tfa) {
            console.log("response.data.tfa = " + response.data.tfa)
            navigate("/validate2fa")
          }
          setUser(response.data)
          },
        (error) => console.log(error)
      );
  }, []);

  const ecole42Auth = () => {
    window.location.href = String(process.env.REACT_APP_URL_AUTH_42);
  };

  const githubAuth = () => {
    window.location.href = String(process.env.REACT_APP_URL_AUTH_GITHUB);
  };

  return (
    <div className={styles.loginCard}>
      {/*<Validate2fa open={modalOpen} setOpen={setModalOpen} />*/}
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
