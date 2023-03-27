import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import EditNickname from './EditNickname';
import EditAvatar from './EditAvatar';
import Enable2fa from './Enable2fa';
import ButtonPong from '../UI/ButtonPong';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import { MatchHistory } from '../../types/MatchHistory';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './styles/Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [modalNicknameOpen, setModalNicknameOpen] = useState(false);
  const [modalAvatarOpen, setModalAvatarOpen] = useState(false);
  const [modal2faOpen, setModal2faOpen] = useState(false);
  const [matchHistory, setMatchHistory] = useState<MatchHistory>({
    played: '-',
    wins: '-',
    loses: '-'
  });

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

  useEffect(() => {
    if (user.nickname && user.provider) {
      backendAPI.get(`/stats/${user.nickname}`).then(
        (response) => {
          setMatchHistory((prevState) => ({
            ...prevState,
            played: response.data.match_play,
            wins: response.data.match_win,
            loses: response.data.match_lose
          }));
        },
        (error) => {
          errorAlert(`Failed to get player's match history`);
        }
      );
    }
  }, [user.nickname]);

  return !user.nickname && user.provider ? (
    <EditNickname open={true} setOpen={setModalNicknameOpen} />
  ) : (
    <div className={styles.basicCard}>
      <div className={styles.header}>
        <h5>Profile card</h5>
      </div>
      <div className={styles.profileCard}>
        <div className={styles.left}>
          <div className={styles.box}>
            <div className={styles.up}>
              <Avatar
                alt=""
                src={user.avatar}
                sx={{ width: 200, height: 200 }}
              />
            </div>
            <div className={styles.bottomAvatarBox}>
              <ButtonPong
                text="Change"
                title="upload new avatar"
                startIcon={<AddAPhotoIcon />}
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
                textColor="rgb(37, 120, 204)"
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
                title={
                  user.totpSecret?.verified ? 'turn off 2FA' : 'turn on 2FA'
                }
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
                textColor="rgb(37, 120, 204)"
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
                textColor="rgb(37, 120, 204)"
              >
                Briefs
              </Typography>
              <List
                sx={{ display: 'flex', alignItems: 'center' }}
                aria-labelledby="basic-list"
              >
                <ListItem>Wins: {matchHistory.wins}</ListItem>
                <ListItem>Loses: {matchHistory.loses}</ListItem>
              </List>
            </div>
            <div className={styles.bottom}>
              <ButtonPong
                text="Full stats"
                title="go to match history page"
                onClick={() => navigate(`/players/${user.nickname}`)}
                endIcon={<ArrowForwardIosIcon />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
