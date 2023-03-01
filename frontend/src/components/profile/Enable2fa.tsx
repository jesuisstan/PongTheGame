import SaveIcon from '@mui/icons-material/Save';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import QRCode from 'qrcode';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import backendAPI from '../../api/axios-instance';
import { UserContext } from '../../contexts/UserContext';
import errorAlert from '../UI/errorAlert';
import styles from './Profile.module.css';

const URL_TOTP_TOGGLE =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_TOTP_TOGGLE);
const URL_TOTP_VERIFY = `${process.env.REACT_APP_URL_BACKEND}/auth/totp/activate`;
// String(process.env.REACT_APP_URL_BACKEND) +
// String(process.env.REACT_APP_URL_TOTP_VERIFY);
const URL_GET_SECRET = `${process.env.REACT_APP_URL_BACKEND}/auth/totp`;
//String(process.env.REACT_APP_URL_BACKEND) + '/auth/totp'; //todo change URL

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
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
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [loadCreateQr, setLoadCreateQr] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const createQRcode = () => {
    return backendAPI.post(URL_GET_SECRET).then(
      (response) => {
        QRCode.toDataURL(response.data).then(setQrCodeUrl);
      },
      (error) => errorAlert("Failed to create QR code")
    );
  };

  const showQRcode = async () => {
    setLoadCreateQr(true);
    await createQRcode();
    setLoadCreateQr(false);
  };

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (newValue.match(/[^0-9]/)) {
      setError('Only numbers acceptable');
    } else {
      setError('');
      setText(newValue);
    }
  };

  const verifyCode = async () => {
    return backendAPI.post(URL_TOTP_VERIFY, { token: text }).then(
      (response) => {
        console.log('QR code verified');
        localStorage.setItem('totpEnabled', 'true'); // change to User.field later
        localStorage.setItem('totpVerified', 'true');
        console.log('TOTP_VERIFY response.data => ' + response.data);
      },
      (error) => {
        if (error?.response?.status === 400) {
          errorAlert('Invalid code');
        } else {
          errorAlert('Something went wrong');
        }
      }
    );
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoadSubmit(true);
    await verifyCode();
    setLoadSubmit(false);
    setButtonText(
      localStorage.getItem('totpVerified') === 'true' ? 'Done ✔️' : 'Failed ❌'
    );
    setText('');
    setError('');
    setTimeout(() => setOpen(false), 442);
    setTimeout(() => setButtonText('Submit'), 450);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') setOpen(false);
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
                  Install Google Authenticator or Authy.
                </li>
                <li>In the authenticator app, select "+" icon.</li>
                <li>
                  Select "Scan a QR code" and use the phone's camera to scan the
                  following QR code.
                </li>
              </div>

              <div>
                <Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
                  Scan QR Code
                </Typography>
                <div className={styles.QRbox}>
                  {!qrCodeUrl ? (
                    <LoadingButton
                      disabled={qrCodeUrl ? true : false}
                      variant="contained"
                      color="inherit"
                      loading={loadCreateQr}
                      onClick={showQRcode}
                    >
                      Show QR Code
                    </LoadingButton>
                  ) : (
                    <img className={styles.QRimage} src={qrCodeUrl} alt="" />
                  )}
                </div>
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
                loading={loadSubmit}
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
