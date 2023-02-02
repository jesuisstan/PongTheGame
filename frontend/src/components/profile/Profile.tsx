import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import ChangeNickname from './ChangeNickname';
import styles from './Profile.module.css';

const Profile = ({ user, setNickname }: any) => {
  const [open, setOpen] = useState(true);
  const [text, setText] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (text) setNickname(text);
    setText('');
    setOpen(false);
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
              Create your nickname
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>New one</FormLabel>
                  <Input
                    autoFocus
                    required
                    value={text}
                    onChange={(event) => setText(event.target.value)}
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
        <div className={styles.box1}>
          <Avatar alt="" src={user.avatar} sx={{ width: 200, height: 200 }} />
          <Button variant="outlined">Change avatar</Button>
        </div>

        <div className={styles.box2}>
          <p>login method: {user.provider}</p>
          <Button variant="outlined">Enable 2-Step Verification</Button>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.box3}>
          <p>Player: {user.username}</p>
          <p>Nickname: {user.nickname}</p>
          <ChangeNickname user={user} setNickname={setNickname}/>
        </div>

        <div className={styles.box4}>
          <p>Brief stats</p>
          <Typography component="legend">Rating</Typography>
          <Rating name="read-only" value={4} readOnly />
          <Button variant="outlined" endDecorator={<ArrowForwardIosIcon />}>
            Full stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
