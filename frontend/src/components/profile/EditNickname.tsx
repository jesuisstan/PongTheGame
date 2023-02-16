import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import TextField from '@mui/material/TextField';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5a6',
  borderRadius: '4px'
};

const EditNickname = ({ open, setOpen }: any) => {
  const { user, setUser } = useContext(UserContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (!newValue.match(/[%<>\\$|/?* +^.()\[\]]/)) {
      setError('');
      setText(newValue);
    } else {
      setError('Forbidden: [ ] < > ^ $ % . \\ | / ? * + ( ) space');
    }
  };

  const warningNameUsed = () => {
    setOpen(false);
    Swal.fire({
      showConfirmButton: false,
      icon: 'error',
      iconColor: '#fd5087',
      width: 450,
      title: 'Oops...',
      text: 'This nickname is already used',
      showCloseButton: true,
      color: 'whitesmoke',
      background: 'black'
    });
  };

  const warningWentWrong = () => {
    setOpen(false);
    Swal.fire({
      showConfirmButton: false,
      icon: 'error',
      iconColor: '#fd5087',
      width: 450,
      title: 'Oops...',
      text: 'Something went wrong',
      showCloseButton: true,
      color: 'whitesmoke',
      background: 'black'
    });
  };

  const setNickname = (value: string) => {
    return axios
      .patch(
        String(process.env.REACT_APP_URL_SET_NICKNAME),
        { nickname: value },
        {
          withCredentials: true,
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }
      )
      .then(
        (response) => {
          setUser(response.data);
        },
        (error) => {
          console.log(error);
          error.request.status === 400 ? warningNameUsed() : warningWentWrong();
        }
      );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (text) {
      setLoad(true);
      await setNickname(text);
      setLoad(false);
      setButtonText('Done ✔️');
    }
    setText('');
    setError('');
    setTimeout(() => setOpen(false), 442);
    setTimeout(() => setButtonText('Submit'), 442);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (user.nickname) setOpen(false);
          if (event && reason == 'backdropClick') return;
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={modalDialogStyle}
        >
          <ModalClose />
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
              <LoadingButton
                type="submit"
                loading={load}
                startIcon={<SaveIcon />}
                variant="contained"
                color="inherit"
              >
                {buttonText}
              </LoadingButton>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditNickname;
