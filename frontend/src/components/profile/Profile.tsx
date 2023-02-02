import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/material/Checkbox';
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
          <Button variant="outlined" endDecorator={<AddAPhotoIcon />}>
            Change avatar
          </Button>
        </div>

        <div className={styles.box2}>
          <div>
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
                2-Step Verification:{' '}
                {<Checkbox onClick={enableTwoStepVerification} />}
              </ListItem>
            </List>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.box3}>
          <div>
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
          <ChangeNickname user={user} setNickname={setNickname} />
        </div>

        <div className={styles.box4}>
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
          <Button variant="outlined" endDecorator={<ArrowForwardIosIcon />}>
            Full stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
