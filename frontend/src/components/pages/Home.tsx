import Mate from '../UI/Mate';
import styles from './OtherPages.module.css';

const Home = () => {
  return (
    <div className={styles.basicCard}>
      <h1>Why?</h1>
      <p>Thanks to this website, you will play Ping-Pong with others</p>
      <p>About us and our Project</p>
      <div className={styles.aboutCards}>
        <Mate
          style={styles.barbara}
          firstName="Barbara"
          lastName="Cano"
          login="bcano"
          role="Frontend: chat, home page"
          description="I made this shit and i wanna die 💀🔫"
          github="https://github.com/BarbaraC12"
          email="bcano@student.42.fr"
        />
        <Mate
          style={styles.benjamin}
          firstName="Benjamin"
          lastName="Brassart"
          login="bbrassar"
          role="Backend: ...."
          description="Catch phrase"
          github="https://github.com/benjaminbrassart"
          email="bbrassar@student.42.fr"
        />
        <Mate
          style={styles.florian}
          firstName="Florian"
          lastName="Catinaud"
          login="fcatinau"
          role="Backend: player's achievements, token-control..."
          description="Catch phrase"
          github="https://github.com/Balgor18"
          email="fcatinau@student.42.fr"
        />
        <Mate
          style={styles.daisuke}
          firstName="Daisuke"
          lastName="Tanigawa"
          login="dtanigaw"
          role="Backend: chat. DevOps: docker-compose..."
          description="Catch phrase"
          github="https://github.com/BarbaraC12"
          email="dtanigaw@student.42.fr"
        />
        <Mate
          style={styles.stan}
          firstName="Stanislav"
          lastName="Krivtsoff"
          login="acaren"
          role="Front: profile, login, auth, pong the game, stats"
          description="Let's do it ⚡ 💪"
          github="https://github.com/ichbinstannis"
          email="acaren@student.42.fr"
        />
      </div>
    </div>
  );
};

export default Home;
