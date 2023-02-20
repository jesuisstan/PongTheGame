import {
  useState,
  useContext,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import QRCode from 'qrcode';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import errorAlert from '../UI/errorAlert';

const URL_TOGGLE_TFA =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_TOGGLE_TFA);
const URL_VALIDATE_2FA =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_VALIDATE_2FA);

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5a6',
  borderRadius: '4px'
};

const Enable2fa = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, setUser } = useContext(UserContext);
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');
  const [qrCodeUrl, setqrCodeUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    QRCode.toDataURL('').then(setqrCodeUrl);
  }, []);

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (newValue.match(/[^0-9]/)) {
      setError('Only numbers acceptable');
    } else {
      setError('');
      setText(newValue);
    }
  };

  const submitCode = async () => {
    return axios
      .patch(
        URL_VALIDATE_2FA,
        { nickname: 'value' },
        {
          withCredentials: true,
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }
      )
      .then(
        (response) => {
          console.log('QR proof submitted');
        },
        (error) => {
          console.log(error);
          errorAlert('Something went wrong');
        }
      );
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoad(true);
    await submitCode(); //todo
    setLoad(false);
    setButtonText('Done ✔️');
    setText('');
    setError('');
    axios
      .patch(
        URL_TOGGLE_TFA,
        { enabled: true },
        {
          withCredentials: true,
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }
      )
      .then(
        (response) => {
          setUser(response.data);
        },
        (error) => errorAlert('Something went wrong')
      );
    setTimeout(() => setOpen(false), 442);
    setTimeout(() => setButtonText('Submit'), 442);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason == 'closeClick') setOpen(false);
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={modalDialogStyle}
        >
          <ModalClose />
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
                Configuring Google Authenticator or Authy
              </Typography>
              <div>
                <li>
                  Install Google Authenticator (IOS - Android) or Authy (IOS -
                  Android).
                </li>
                <li>In the authenticator app, select "+" icon.</li>
                <li>
                  Select "Scan a barcode (or QR code)" and use the phone's
                  camera to scan this barcode.
                </li>
              </div>

              <div>
                <Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
                  Scan QR Code
                </Typography>
                <img src={qrCodeUrl} alt="qrcode url" />
              </div>
              <div>
                <Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
                  Verify Code
                </Typography>
              </div>
              <TextField
                autoFocus
                required
                value={text}
                inputProps={{
                  minLength: 6,
                  maxLength: 6
                }}
                placeholder="Authentication Code"
                helperText={error} // error message
                error={!!error} // set to true to change the border/helperText color to red
                onChange={handleTextInput}
              />
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

export default Enable2fa;
