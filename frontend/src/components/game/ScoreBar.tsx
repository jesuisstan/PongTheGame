import { CurrentGamePlayer } from './game.interface';
import Avatar from '@mui/material/Avatar';
import styles from './styles/ScoreBar.module.css';
import { useState, useEffect } from 'react';
import goalAlert from './utils/goalAlert';

const ScoreBar = ({
  winScore,
  players
}: {
  winScore: number;
  players: CurrentGamePlayer[];
}) => {
  const [prevScores, setPrevScores] = useState([
    players[0].score,
    players[1].score
  ]);

  useEffect(() => {
    if (
      players[0].score !== prevScores[0] ||
      players[1].score !== prevScores[1]
    ) {
      goalAlert();
    }
    setPrevScores([players[0].score, players[1].score]);
  }, [players]);

  return (
    <div>
      <div className={styles.avatarsBlock}>
        <Avatar
          alt=""
          src={players![0].infos.avatar}
          sx={{
            width: 70,
            height: 70
          }}
          title={players![0].infos.name}
        />
        VS.
        <Avatar
          alt=""
          src={players![1].infos.avatar}
          sx={{
            width: 70,
            height: 70
          }}
          title={players![1].infos.name}
        />
      </div>
      <div className={styles.scoreBar}>
        <div className={styles.left}>
          {players![0].infos.name}: {players![0].score}
        </div>
        <div className={styles.center}>Win score: {winScore}</div>
        <div className={styles.right}>
          {players![1].infos.name ? players![1].infos.name : 'AI'}:{' '}
          {players![1].score}
        </div>{' '}
      </div>
    </div>
  );
};

export default ScoreBar;
