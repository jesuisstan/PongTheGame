import Peer from '../UI/Peer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import styles from './styles/About.module.css';

const avatarStyle = {
  width: 121,
  height: 121,
  transition: 'transform 0.3s ease-out',
  border: '2px solid black',
  ':hover': {
    cursor: 'pointer',
    transform: 'scale(1.03)'
  }
};

const About = () => {
  return (
    <div className={styles.basicCard}>
      <div className={styles.group}>
        <div className={styles.header}>
          <h5>
            We, being faithful to the original Pong (1972), are:
          </h5>
        </div>
        <div className={styles.aboutCards}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}
          >
            <Peer
              style={styles.stan}
              firstName="Stanislav"
              lastName="Krivtsoff"
              description="Sitôt dit, sitôt fait ⚡"
              intraNickname="acaren"
              duty="Frontend: the entire front of this site"
              duty2="Backend: AI & Obstacle move and physics"
              duty3="DevOps: deploying DO server & applying DNS"
              github="https://github.com/jesuisstan"
            />
            <Peer
              style={styles.benjamin}
              firstName="Benjamin"
              lastName="Brassart"
              description="I need coffee"
              intraNickname="bbrassar"
              duty="Backend: authentication & 2-Step Verification "
              duty2="Backend: profile customization"
              duty3="DevOps: Docker compose & Makefile"
              github="https://github.com/benjaminbrassart"
            />
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}
          >
            <Peer
              style={styles.florian}
              firstName="Florian"
              lastName="Catinaud"
              description="An asshole with a keyboard"
              intraNickname="fcatinau"
              duty="Backend: socket system, endpoints"
              duty2="Backend: Prisma database"
              duty3="Backend: Game, Friends system, Match history"
              github="https://github.com/Balgor18"
            />
            <div className={styles.special}>
              <Stack spacing={4}>
                <Typography
                  id="basic-list-demo"
                  variant="h3"
                  fontSize={21}
                  textTransform="uppercase"
                  fontWeight="bold"
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
                    variant="rounded"
                    alt=""
                    src={require('../../assets/ecole42.png')}
                    sx={{...avatarStyle, boxSizing: 'border-box'}}
                    title="Proceed to École 42"
                    onClick={() => {
                      window.open('https://42.fr/en/homepage/');
                    }}
                  />
                  <Avatar
                    variant="rounded"
                    alt=""
                    src={require('../../assets/allan.jpg')}
                    sx={{...avatarStyle, boxSizing: 'border-box', padding: '2px'}}
                    title="Proceed to Original Pong creator wiki"
                    onClick={() => {
                      window.open('https://en.wikipedia.org/wiki/Allan_Alcorn');
                    }}
                  />
                  <Avatar
                    variant="rounded"
                    alt=""
                    src={require('../../assets/atari.png')}
                    sx={{...avatarStyle, boxSizing: 'border-box'}}
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

export default About;
