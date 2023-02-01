import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import ChangeNickname from './ChangeNickname';
import CreateNickname from './ChangeNickname';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './Profile.module.css';

const Profile = ({ user }: any) => {
  return !user.nickname ? (
    <h1>Create nickname</h1>
    //<CreateNickname user={user}> </CreateNickname>
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.left}>
        <div className={styles.box1}>
          <Avatar alt="" src={user.avatar} sx={{ width: 200, height: 200 }} />
          <Button variant="contained">Change avatar</Button>
        </div>

        <div className={styles.box2}>
          <p>login method: {user.provider}</p>
          <Button variant="contained">Enable 2-Step Verification</Button>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.box3}>
          <p>Player: {user.username}</p>
          <p>Nickname: {user.nickname}</p>
          <ChangeNickname />
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
