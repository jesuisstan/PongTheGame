import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from './Game.module.css';

const ScoreBar = ({
  winScore,
  setWinScore,
  score,
  gameOn
}: {
  winScore: number;
  setWinScore: React.Dispatch<React.SetStateAction<number>>;
  score: {
    player1: number;
    player2: number;
  };
  gameOn: boolean;
}) => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.scoreBar}>
      <div>
        {user.nickname}: {score.player1}
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
            onChange={(event) => setWinScore(event.target.value as number)}
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
      <div>Opponent: {score.player2}</div> {/*todo change name to other player*/}
    </div>
  );
};

export default ScoreBar;
