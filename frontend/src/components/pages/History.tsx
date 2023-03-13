import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PleaseLogin from './PleaseLogin';
import styles from './Pages.module.css';

const History = () => {
  const { user } = useContext(UserContext);

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className={styles.parent}>
      <div className={styles.centeredCard}>
        <h1>statistics, achievements, match history, etc.</h1>
      </div>
    </div>
  );
};

export default History;
