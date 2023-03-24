import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ButtonPong from '../UI/ButtonPong';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from './Game.module.css';

const GameBar = ({
  setTrainMode,
  //setScore,
  gameOn,
  setGameOn,
  gamePaused,
  setGamePaused,
  bonusMode,
  setBonusMode
}: {
  setTrainMode: React.Dispatch<React.SetStateAction<boolean>>;
  //setScore: React.Dispatch<React.SetStateAction<Score>>;
  gameOn: boolean;
  setGameOn: React.Dispatch<React.SetStateAction<boolean>>;
  gamePaused: boolean;
  setGamePaused: React.Dispatch<React.SetStateAction<boolean>>;
  bonusMode: boolean;
  setBonusMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useContext(UserContext);

  const trainWithComputer = async () => {
    setTrainMode(true);
    if (!gameOn) {
      //setScore({ player1: 0, player2: 0 });
      setGameOn(true);
    }
  };

  return (
    <div className={styles.buttonsBlock}>
      <ButtonPong
        text="train with AI"
        title="practice with computer"
        disabled={gameOn ? true : false}
        onClick={trainWithComputer}
      />
      <FormControlLabel
        title="change the map"
        control={
          <Switch
            disabled={gameOn ? true : false}
            checked={bonusMode}
            onClick={() => setBonusMode(!bonusMode)}
          />
        }
        label="Bonus mode"
      />
      <ButtonPong
        text={gamePaused ? 'unpause' : 'pause'}
        title={gamePaused ? 'continue the game' : 'set the game on pause'}
        disabled={gameOn ? false : true}
        onClick={() => {
          setGamePaused(!gamePaused);
        }}
      />
      <ButtonPong
        text="Find opponent"
        onClick={() => console.log('find opp clicked')}
      />
    </div>
  );
};

export default GameBar;
