import { useState, useContext, useRef } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from '../pages/PleaseLogin';
import styles from './Game.module.css';
import Pong from './Pong';

const Game = () => {
  const { user, setUser } = useContext(UserContext);

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className={styles.basic}>
      <Pong />
    </div>
  );
};

export default Game;
