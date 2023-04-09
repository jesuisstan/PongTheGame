import Peer from '../UI/Peer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import styles from './styles/About.module.css';

const avatarStyle = {
  width: 121,
  height: 121,
  ':hover': {
    cursor: 'pointer',
    transform: 'scale(1.04)',
    transition: 'transform 0.3s ease-out'
  }
};

const Home = () => {
  return (
    <div className={styles.basicCard}>
      <div className={styles.group}>
        <div className={styles.header}>
          <h5>
            We, being faithful to the original{' '}
            <a
              href="https://en.wikipedia.org/wiki/Pong"
              target="_blank"
              rel="noreferrer"
              title="Proceed to Original Pong wiki"
            >
              Pong (1972)
            </a>
            , are:
          </h5>
        </div>
        <div className={styles.aboutCards}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}
          >
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
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}
          >
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
            <div className={styles.special}>
              <Stack spacing={2}>
                <Typography
                  id="basic-list-demo"
                  variant="h3"
                  fontSize={21}
                  textTransform="uppercase"
                  fontWeight="lg"
                >
                  Special thanks to:
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '42px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    variant="square"
                    alt=""
                    src={require('../../assets/ecole42.png')}
                    sx={avatarStyle}
                    title="Proceed to École 42"
                    onClick={() => {
                      window.open('https://42.fr/en/homepage/');
                    }}
                  />
                  <Avatar
                    variant="square"
                    alt=""
                    src={require('../../assets/allan.jpg')}
                    sx={avatarStyle}
                    title="Proceed to Original Pong creator wiki"
                    onClick={() => {
                      window.open('https://en.wikipedia.org/wiki/Allan_Alcorn');
                    }}
                  />
                  <Avatar
                    variant="square"
                    alt=""
                    src={require('../../assets/atari.png')}
                    sx={avatarStyle}
                    title="Proceed to Atari wiki"
                    onClick={() => {
                      window.open('https://en.wikipedia.org/wiki/Atari,_Inc.');
                    }}
                  />
                </div>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
