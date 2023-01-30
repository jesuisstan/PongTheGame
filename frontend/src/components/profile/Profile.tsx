import { User } from '../../types/User';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './Profile.module.css';

const Profile = ({ user }: any) => {
  return !user.provider ? (
    <h1>No user logged in</h1>
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.left}>
        <div className={styles.box1}>
          <img className={styles.avatarBig} src={user.avatar} alt="IMG" />
        </div>

        <div className={styles.box2}>
          <p>login method: {user.provider}</p>
          <Button variant="contained">Enable 2-Step Verification</Button>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.box3}>
          <p>{user.displayName}</p>
          <p>login: {user.username}</p>
        </div>

        <div className={styles.box4}>
          <p>Brief stats</p>
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" value={5} readOnly />
          <Button variant="contained" endIcon={<ArrowForwardIosIcon />}>
            Full stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
