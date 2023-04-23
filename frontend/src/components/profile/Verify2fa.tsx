import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { AxiosError } from 'axios';
import { User } from '../../types/User';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import * as MUI from '../UI/MUIstyles';

const Verify2fa = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');
  const [buttonClickable, setButtonClickable] = useState(true);

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

    if (buttonClickable && text.length !== 0) {
      setLoad(true);
      setButtonClickable(false);
      try {
        const userData = (
          await backendAPI.post<User>('/auth/totp/verify', {
            token: text
          })
        ).data;
        setUser(userData);
        setButtonText('Done ✔️');
        setText('');
        setError('');
        setTimeout(() => {
          setOpen(false);
          setButtonText('Submit');
        }, 442);
        setTimeout(() => navigate('/profile'), 500);
      } catch (error) {
        const err = error as AxiosError<any>;
        const message =
          err.response?.data?.message ?? 'Failed to validate code';

        setButtonText('Failed ❌');
        setTimeout(() => {
          errorAlert(`${message}! Try again.`);
          setButtonClickable(true);
          setButtonText('Submit');
        }, 500);
      }
      setLoad(false);
    }
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            sx={MUI.modalHeader}
          >
            Verifying 2FA Code
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <div style={MUI.loadButtonBlock}>
                <FormControl>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FormLabel sx={{ color: 'black' }}>6 digits:</FormLabel>
                  </Box>
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
              </div>
              <div style={MUI.loadButtonBlock}>
                <LoadingButton
                  type="submit"
                  loading={load}
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="inherit"
                  disabled={!buttonClickable}
                  sx={{ minWidth: 142 }}
                >
                  {buttonText}
                </LoadingButton>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Verify2fa;
