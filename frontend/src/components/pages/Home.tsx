import Peer from '../UI/Peer';
import Typography from '@mui/joy/Typography';
import styles from './OtherPages.module.css';

const Home = () => {
  return (
    <div className={styles.basicCard}>
      <h5>Why?</h5>
      <p>Thanks to this website, you will play Ping-Pong with others</p>
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
          description="'Catch phrase'"
          intraNickname="bbrassar"
          role="Backend: ...."
          github="https://github.com/benjaminbrassart"
        />
        <Peer
          style={styles.barbara}
          firstName="Barbara"
          lastName="Cano"
          description="I made this shit and i wanna die 💀🔫"
          intraNickname="bcano"
          role="Frontend: chat, home page"
          github="https://github.com/BarbaraC12"
        />
        <Peer
          style={styles.florian}
          firstName="Florian"
          lastName="Catinaud"
          description="'Catch phrase'"
          intraNickname="fcatinau"
          role="Backend: player's achievements, token-control..."
          github="https://github.com/Balgor18"
        />
        <Peer
          style={styles.stan}
          firstName="Stanislav"
          lastName="Krivtsoff"
          description="'Let's do it!' ⚡"
          intraNickname="acaren"
          role="Frontend: profile, login, auth, pong the game, stats"
          github="https://github.com/ichbinstannis"
        />
        <Peer
          style={styles.daisuke}
          firstName="Daisuke"
          lastName="Tanigawa"
          description="'Catch phrase'"
          intraNickname="dtanigaw"
          role="Backend: chat. DevOps: docker-compose..."
          github="https://github.com/BarbaraC12"
        />
      </div>
    </div>
  );
};

export default Home;
