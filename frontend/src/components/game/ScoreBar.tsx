import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Player } from '../../types/Player';
import { Player_game } from './game.interface';
import styles from './Game.module.css';

const ScoreBar = ({
  winScore,
  players
}: {
  winScore: number;
  players: Player_game[];
}) => {
  return (
    <div className={styles.scoreBar}>
      <div className={styles.left}>
        {players![0].infos.name}: {players![0].score}
      </div>
      <div className={styles.center}>Win score: {winScore}</div>
      <div className={styles.right}>
        {players![1].infos.name}: {players![1].score}
      </div>{' '}
    </div>
  );
};

export default ScoreBar;
