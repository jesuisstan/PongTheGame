import { useState } from 'react';
import { User } from '../../types/User';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

export default function CreateNickname(props: any) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" component="h2">
            Create your nickname
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              props.user.nickname = 'STANNN';
              setOpen(false);
            }}
          >
            <Stack spacing={1}>
              <FormControl>
                <FormLabel>New one</FormLabel>
                <Input autoFocus required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
}
