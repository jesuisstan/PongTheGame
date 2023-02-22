import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from './PleaseLogin';

const History = () => {
  const { user } = useContext(UserContext);

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className="baseCard">
      <h1>statistics, achievements, match history, etc.</h1>
    </div>
  );
};

export default History;
