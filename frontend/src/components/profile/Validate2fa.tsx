import SaveIcon from '@mui/icons-material/Save';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backendAPI from '../../api/axios-instance';
import { UserContext } from '../../contexts/UserContext';
import { User } from '../../types/User';

const URL_LOGOUT = String(process.env.REACT_APP_URL_LOGOUT);

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
  borderRadius: '4px'
};

const Validate2fa = ({
  open,
  setOpen,
  userData
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userData: User | undefined;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (newValue.match(/[^0-9]/)) {
      setError('Only numbers acceptable');
    } else {
      setError('');
      setText(newValue);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (text) {
      setLoad(true);

      try {
        const user = (
          await backendAPI.post<User>('/auth/totp/verify', {
            token: text
          })
        ).data;

        setUser(user);
        setButtonText('Done ✔️');
        setText('');
        setError('');

        setTimeout(() => setOpen(false), 442);
        setTimeout(() => setButtonText('Submit'), 442);
        setTimeout(() => navigate('/profile'), 500);
      } catch (e) {
        const err = e as AxiosError;

        setError((err.response?.data as any).message);
      }

      setLoad(false);
    }
  };

  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open}>
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
            Verifying 2FA Code
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel sx={{ color: 'black' }}>6 digits:</FormLabel>
                <TextField
                  autoFocus
                  required
                  value={text}
                  inputProps={{
                    minLength: 6,
                    maxLength: 6
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

export default Validate2fa;
