import { useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import TextField from '@mui/material/TextField';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

const EditNickname = ({ user, setNickname, open, setOpen }: any) => {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text) setNickname(text);
    setText('');
    setError('');
    setOpen(false);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={() => {
          if (user.nickname) {
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={{ maxWidth: 500, color: 'black' }}
        >
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            sx={{ color: 'black' }}
          >
            Modifying your nickname
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel sx={{ color: 'black' }}>
                  3 - 20 characters:
                </FormLabel>
                <TextField
                  autoFocus
                  required
                  value={text}
                  inputProps={{
                    minLength: 3,
                    maxLength: 20
                  }}
                  helperText={error} // error message
                  error={!!error} // set to true to change the border/helperText color to red
                  onChange={handleTextInput}
                />
              </FormControl>
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  ':hover': {
                    borderColor: 'black',
                    fontWeight: 'Bold'
                  }
                }}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditNickname;
