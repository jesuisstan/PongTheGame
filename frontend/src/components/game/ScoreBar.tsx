import { CurrentGamePlayer } from './game.interface';
import styles from './styles/ScoreBar.module.css';

const ScoreBar = ({
  winScore,
  players
}: {
  winScore: number;
  players: CurrentGamePlayer[];
}) => {
  return (
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
  );
};

export default ScoreBar;
