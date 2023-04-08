import Peer from '../UI/Peer';
import Typography from '@mui/joy/Typography';
import styles from './styles/About.module.css';

const Home = () => {
  return (
    <div className={styles.basicCard}>
      <div className={styles.group}>
        <div className={styles.header}>
          <h5>We, being faithful to the original Pong (1972), are:</h5>
        </div>
        <div className={styles.aboutCards}>
          <Peer
            style={styles.benjamin}
            firstName="Benjamin"
            lastName="Brassart"
            description="I need a coffee"
            intraNickname="bbrassar"
            role="Backend: authentication, 2FA, avatar upload"
            github="https://github.com/benjaminbrassart"
          />
          <Peer
            style={styles.barbara}
            firstName="Barbara"
            lastName="Cano"
            description="We did it!"
            intraNickname="bcano"
            role="Frontend: chat, teammate card template"
            github="https://github.com/BarbaraC12"
          />
          <Peer
            style={styles.florian}
            firstName="Florian"
            lastName="Catinaud"
            description="An asshole with a Keyboard"
            intraNickname="fcatinau"
            role="Backend: Game, Friends, Achievements & Stats"
            github="https://github.com/Balgor18"
          />
          <Peer
            style={styles.stan}
            firstName="Stanislav"
            lastName="Krivtsoff"
            description="I will solve this ⚡"
            intraNickname="acaren"
            role="Frontend: the entire frontend except for the Chat page"
            github="https://github.com/jesuisstan"
          />
          <Peer
            style={styles.daisuke}
            firstName="Daisuke"
            lastName="Tanigawa"
            description="I agree with everything that Stan says"
            intraNickname="dtanigaw"
            role="Backend: chat. Docker-compose"
            github="https://github.com/daisvke"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
