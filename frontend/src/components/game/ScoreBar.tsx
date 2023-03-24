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
  setWinScore,
  players,
  score,
  gameOn,
}: {
  winScore: number;
  setWinScore?: React.Dispatch<React.SetStateAction<number>>;
  players?: Player_game[];
  score?: {
    player1: number;
    player2: number;
  };
  gameOn?: boolean;
}) => {
  const { user } = useContext(UserContext);
console.log(players);

  return (
    <div className={styles.scoreBar}>
      <div>
        {/*{players![0].infos.name}: {players![0].score}*/}
      </div>
      <div className={styles.scoreSelector}>
        <div>Win score: </div>
        <FormControl
          size="small"
          sx={{
            m: 0.5,
            backgroundColor: 'whitesmoke',
            width: 70,
            border: '0px solid #f5f5f5ee',
            borderRadius: '4px'
          }}
        >
          <Select
            value={winScore ? winScore : 3}
            disabled={gameOn}
            //onChange={(event) => setWinScore(event.target.value as number)}
            onChange={(event) => console.log('changed...')}
          >
            <MenuItem value={3}>
              <em>3</em>
            </MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={11}>11</MenuItem>
            <MenuItem value={21}>21</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        {/*{players![1].infos.name}: {players![1].score}*/}
      </div>{' '}
    </div>
  );
};

export default ScoreBar;
