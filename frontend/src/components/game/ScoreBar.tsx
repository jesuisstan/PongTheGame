import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Player } from '../../types/Player';
import { Player_game, Props_game, Game_status } from './game.interface';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from './Game.module.css';

const ScoreBar = ({
  winScore,
  players,
  gameOn
}: {
  winScore: number;
  players: Player_game[];
  gameOn?: boolean;
}) => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.scoreBar}>
      <div>
        {players![0].infos.name}: {players![0].score}
      </div>
      <div>Win score: {winScore}</div>

      {/*<div className={styles.scoreSelector}>
        <div>Win score: {winScore}</div>
        
      </div>*/}
      <div>
        {players![1].infos.name}: {players![1].score}
      </div>{' '}
    </div>
  );
};

export default ScoreBar;
