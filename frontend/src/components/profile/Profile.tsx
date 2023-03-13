import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import EditNickname from './EditNickname';
import EditAvatar from './EditAvatar';
import Enable2fa from './Enable2fa';
import ButtonPong from '../UI/ButtonPong';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [modalNicknameOpen, setModalNicknameOpen] = useState(false);
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false);
  const [modal2faOpen, setModal2faOpen] = useState(false);

  const toggleTfa = () => {
    if (user.totpSecret?.verified) {
      return backendAPI.delete('/auth/totp').then(
        (response) => setUser(response.data),
        (error) => errorAlert('Something went wrong')
      );
    } else setModal2faOpen(true);
  };

  const deleteAvatar = () => {
    if (user.avatar) {
      return backendAPI.delete('/avatar').then(
        (response) => setUser(response.data),
        (error) => errorAlert('Something went wrong')
      );
    }
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
          <div className={styles.bottomAvatarBox}>
            <ButtonPong
              text="Change"
              title="upload new avatar"
              endIcon={<AddAPhotoIcon />}
              onClick={() => setModalAvatarOpen(true)}
            />
            <ButtonPong
              text="Delete"
              title="set avatar to default"
              endIcon={<DeleteIcon />}
              onClick={deleteAvatar}
              disabled={!user.avatar}
            />
          </div>
          <EditAvatar open={modalAvatarOpen} setOpen={setModalAvatarOpen} />
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
                {user.totpSecret?.verified ? 'on' : 'off'}
              </ListItem>
            </List>
          </div>
          <div className={styles.bottom}>
            <ButtonPong
              text={user.totpSecret?.verified ? 'Disable 2FA' : 'Setup 2FA'}
              title={user.totpSecret?.verified ? 'turn off 2FA' : 'turn on 2FA'}
              endIcon={<ArrowForwardIosIcon />}
              onClick={toggleTfa}
            />
            <Enable2fa open={modal2faOpen} setOpen={setModal2faOpen} />
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
                title="modify nickname"
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
            <ButtonPong
              text="Full stats"
              title="go to match history page"
              onClick={() => navigate('/history')}
              endIcon={<ArrowForwardIosIcon />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
