import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import styles from './Game.module.css';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ScoreBar = ({
  winScore,
  setWinScore,
  score,
  dis
}: {
  winScore: number;
  setWinScore: any;
  score: any;
  dis: boolean;
}) => {
  const { user } = useContext(UserContext);

  const handleChange = (event: SelectChangeEvent) => {
    setWinScore(event.target.value as string);
  };

  return (
    <div className={styles.scoreBar}>
      <div>
        {user.nickname}: {score.player1}
      </div>
      <div className={styles.scoreSelector}>
        <div>

        Win score:{' '}
        </div>
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
            value={winScore ? String(winScore) : 3}
            disabled={!dis}
            onChange={(event) => setWinScore(event.target.value as string)}
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

      <div>Opponent: {score.player2}</div>
    </div>
  );
};

export default ScoreBar;
