import ButtonPong from '../UI/ButtonPong';
import styles from './styles/Lobby.module.css';

const Lobby = ({
  joinQueue,
  launchTraining
}: {
  joinQueue: () => void;
  launchTraining: () => void;
}) => {
  return (
    <div className={styles.parent}>
      <div className={styles.lobbyCard}>
        <ButtonPong text="Random game" onClick={joinQueue} />
        <ButtonPong text="Practise with AI" onClick={launchTraining} />
      </div>
    </div>
  );
};

export default Lobby;
