import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Button from '@mui/material/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import TextField from '@mui/material/TextField';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/material/Checkbox';
import ChangeNickname from './ChangeNickname';
import ButtonPong from '../UI/ButtonPong';
import styles from './Profile.module.css';

const Profile = ({ user, setNickname }: any) => {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (!newValue.match(/[%<>\\$|/?* +^.()\[\]]/)) {
      setError('');
      setText(newValue);
    } else {
      setError('Forbidden: [ ] < > ^ $ % . \\ | / ? * + ( ) space');
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (text) setNickname(text);
    setText('');
    setOpen(false);
  };

  const enableTwoStepVerification = () => {
    console.log('2-step Verif checkbox clicked');
  };

  return !user.nickname ? (
    <div>
      <Modal
        open={open}
        onClose={() => {
          if (user.nickname) {
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" component="h2">
            Creating your nickname
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Original one (3 - 20 characters):</FormLabel>
                <TextField
                  autoFocus
                  required
                  value={text}
                  inputProps={{
                    minLength: 3,
                    maxLength: 20
                  }}
                  helperText={error} // error message
                  error={!!error}
                  onChange={handleTextInput}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.left}>
        <div className={styles.box}>
          <div className={styles.up}>
            <Avatar alt="" src={user.avatar} sx={{ width: 200, height: 200 }} />
          </div>
          <div className={styles.bottom}>
            <ButtonPong text="Change avatar" endIcon={<AddAPhotoIcon />} />
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
              <ListItem>login method: {user.provider}</ListItem>
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
            <ChangeNickname user={user} setNickname={setNickname} />
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
