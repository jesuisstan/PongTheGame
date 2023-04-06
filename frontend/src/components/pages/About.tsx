import Peer from '../UI/Peer';
import Typography from '@mui/joy/Typography';
import styles from './Pages.module.css';

const Home = () => {
  return (
    <div className={styles.basicCard}>
      <div className={styles.aboutHeader}>
        <Typography
          id="basic-list-demo"
          level="body3"
          textTransform="uppercase"
          fontWeight="lg"
        >
          We, being faithful to the original Pong (1972), are:
        </Typography>
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
      </div>
      <div className={styles.aboutCards}>
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
      </div>
      <div className={styles.aboutCards}>
        <Peer
          style={styles.daisuke}
          firstName="Daisuke"
          lastName="Tanigawa"
          description="This is a non-mandatory page"
          intraNickname="dtanigaw"
          role="Backend: chat. Docker-compose"
          github="https://github.com/daisvke"
        />
      </div>
    </div>
  );
};

export default Home;
