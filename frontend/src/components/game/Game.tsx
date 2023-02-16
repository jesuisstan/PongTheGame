import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PleaseLogin from '../pages/PleaseLogin';

const Game = () => {
  const { user, setUser } = useContext(UserContext);

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className="baseCard">
      <h1>The game itself</h1>
    </div>
  );
};

export default Game;
