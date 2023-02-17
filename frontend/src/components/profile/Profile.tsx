import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import errorAlert from '../UI/errorAlert';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import CreateIcon from '@mui/icons-material/Create';
import ButtonPong from '../UI/ButtonPong';
import EditNickname from './EditNickname';
import EditAvatar from './EditAvatar';
import Enable2fa from './Enable2fa';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [modalNicknameOpen, setModalNicknameOpen] = useState(false);
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false);
  const [modalTwoFactorAuthOpen, setModalTwoFactorAuthOpen] = useState(false);

  const toggleTfa = () => {
    if (user.tfa) {
      return axios
        .patch(
          String(process.env.REACT_APP_URL_TOGGLE_TFA),
          { enabled: false },
          {
            withCredentials: true,
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
          }
        )
        .then(
          (response) => setUser(response.data),
          (error) => errorAlert('Something went wrong')
        );
    } else setModalTwoFactorAuthOpen(true);
  };

  return !user.nickname && user.provider ? (
    <EditNickname open={true} setOpen={setModalNicknameOpen} />
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
            <EditAvatar open={modalAvatarOpen} setOpen={setModalAvatarOpen} />
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
                2-Factor Authentication: {user.tfa ? 'on' : 'off'}
              </ListItem>
            </List>
          </div>
          <div className={styles.bottom}>
            <ButtonPong
              text={user.tfa === true ? 'Disable 2FA' : 'Setup 2FA'}
              endIcon={<ArrowForwardIosIcon />}
              onClick={toggleTfa}
            />
            <Enable2fa
              open={modalTwoFactorAuthOpen}
              setOpen={setModalTwoFactorAuthOpen}
            />
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
            <List aria-labelledby="basic-list">
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
