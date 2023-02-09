import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/material/Checkbox';
import CreateIcon from '@mui/icons-material/Create';
import ButtonPong from '../UI/ButtonPong';
import EditNickname from './EditNickname';
import EditAvatar from './EditAvatar';
import styles from './Profile.module.css';

const Profile = ({ user, setUser }: any) => {
  const [modalNicknameOpen, setModalNicknameOpen] = useState(false);
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false);

  const enableTwoStepVerification = () => {
    console.log('2-step Verif checkbox clicked');
  };

  return !user.nickname ? (
    <EditNickname
      user={user}
      setUser={setUser}
      open={true}
      setOpen={setModalNicknameOpen}
    />
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.left}>
        <div className={styles.box}>
          <div className={styles.up}>
            <Avatar alt="" src={user.avatar} sx={{ width: 200, height: 200 }} />
          </div>
          <div className={styles.bottom}>
            <ButtonPong
              text="Change avatar"
              endIcon={<AddAPhotoIcon />}
              onClick={() => setModalAvatarOpen(true)}
            />
            <EditAvatar
              user={user}
              open={modalAvatarOpen}
              setOpen={setModalAvatarOpen}
            />
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.up}>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Auth
            </Typography>
            <List aria-labelledby="basic-list-demo">
              <ListItem>Login method: {user.provider}</ListItem>
              <ListItem>
                2-Factor Authentication:{' '}
                {<Checkbox onClick={enableTwoStepVerification} />}
              </ListItem>
            </List>
          </div>
          <div className={styles.bottom}>
            <ButtonPong text="Enable 2FA" endIcon={<ArrowForwardIosIcon />} />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.box}>
          <div className={styles.up}>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Info
            </Typography>
            <List aria-labelledby="basic-list-demo">
              <ListItem>Player: {user.username}</ListItem>
              <ListItem>Nickname: {user.nickname}</ListItem>
            </List>
          </div>
          <div className={styles.bottom}>
            <div>
              <ButtonPong
                text="Change nickname"
                endIcon={<CreateIcon />}
                onClick={() => setModalNicknameOpen(true)}
              />
              <EditNickname
                user={user}
                setUser={setUser}
                open={modalNicknameOpen}
                setOpen={setModalNicknameOpen}
              />
            </div>
          </div>
        </div>

        <div className={styles.box}>
          <div className={styles.up}>
            <Typography
              id="basic-list-demo"
              level="body3"
              textTransform="uppercase"
              fontWeight="lg"
            >
              Briefs
            </Typography>
            <Typography component="legend">Rating</Typography>
            <Rating name="read-only" value={4} readOnly />
          </div>
          <div className={styles.bottom}>
            <ButtonPong text="Full stats" endIcon={<ArrowForwardIosIcon />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
