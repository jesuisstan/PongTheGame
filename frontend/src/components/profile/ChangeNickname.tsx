import { useState } from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import CreateIcon from '@mui/icons-material/Create';
import Typography from '@mui/joy/Typography';

const ChangeNickname = ({ user, setNickname }: any) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (text) setNickname(text);
    setText('');
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="neutral"
        endDecorator={<CreateIcon />}
        onClick={() => setOpen(true)}
      >
        Change nickname
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" component="h2">
            Changing your nickname
          </Typography>
          <form
            onSubmit={handleSubmit}
          >
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
  );
};

export default ChangeNickname;
