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
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <div>Singleplayer</div>
            <ButtonPong
              text="Train"
              title="Play with Artificial Intelligence"
              onClick={launchTraining}
            />
          </div>
          <div className={styles.center}>
            <div className={styles.line} />
          </div>
          <div className={styles.right}>
            <div>Multiplayer</div>
            <ButtonPong
              text="Random"
              title="Play online with random user"
              onClick={joinQueue}
            />
            <ButtonPong
              text="Custom"
              onClick={() => console.log('game with friend')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
