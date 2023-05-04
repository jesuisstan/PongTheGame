import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { User } from '../../types/User';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import QRCode from 'qrcode';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import AdbIcon from '@mui/icons-material/Adb';
import AppleIcon from '@mui/icons-material/Apple';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';
import styles from './styles/Profile.module.css';

const Enable2fa = ({
  open,
  setOpen,
  qrCodeUrl,
  setQrCodeUrl
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  qrCodeUrl: string;
  setQrCodeUrl: Dispatch<SetStateAction<string>>;
}) => {
  const { setUser } = useContext(UserContext);
  const [loadSubmit, setLoadSubmit] = useState(false);
  const [loadCreateQr, setLoadCreateQr] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);

  const createQRcode = () => {
    return backendAPI.post('/auth/totp').then(
      (response) => {
        QRCode.toDataURL(response.data).then(setQrCodeUrl);
      },
      (error) => errorAlert('Failed to create QR code')
    );
  };

  const showQRcode = async () => {
    setLoadCreateQr(true);
    await createQRcode();
    setLoadCreateQr(false);
    setDisabled(false);
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

  const verifyCurrentUser = async () => {
    try {
      const userData = (
        await backendAPI.post<User>('/auth/totp/verify', {
          token: text
        })
      ).data;
      setUser(userData);
    } catch (e) {
      setButtonText('Failed ❌');
    }
  };

  const submitCode = async () => {
    if (!disabled) {
      return backendAPI.post('/auth/totp/activate', { token: text }).then(
        (response) => {
          verifyCurrentUser();
          setButtonText('Done ✔️');
          setDisabled(true);
        },
        (error) => {
          setButtonText('Failed ❌');
          if (error?.response?.status === 400) {
            setTimeout(() => errorAlert('Invalid code'), 500);
          } else {
            setTimeout(() => errorAlert('Something went wrong'), 500);
          }
        }
      );
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoadSubmit(true);
    await submitCode();
    setLoadSubmit(false);
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
          <Typography id="basic-modal-dialog-title" sx={MUI.modalHeader}>
            Setting up 2-Step Verification
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography
                component="h3"
                sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
              >
                Configuring Google Authenticator:
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  1. Install Google Authenticator:{' '}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=fr&gl=US"
                    target="_blank"
                    rel="noreferrer"
                    title="Proceed to Google Play"
                  >
                    <AdbIcon
                      fontSize="large"
                      sx={{
                        color: 'black',
                        '&:hover': {
                          color: color.PONG_PINK
                        }
                      }}
                    />
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://apps.apple.com/fr/app/google-authenticator/id388497605"
                    target="_blank"
                    rel="noreferrer"
                    title="Proceed to App Store"
                  >
                    <AppleIcon
                      fontSize="large"
                      sx={{
                        color: 'black',
                        '&:hover': {
                          color: color.PONG_PINK
                        }
                      }}
                    />
                  </a>
                </Typography>
                <Typography>
                  2. In the authenticator app, select "+" icon
                </Typography>
                <Typography>
                  3. Select "Scan a QR code" and use the phone's camera to scan
                  the following QR code
                </Typography>
              </Stack>
              <div>
                <Typography
                  component="h3"
                  sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                >
                  Scan QR Code:
                </Typography>
                <div className={styles.QRbox}>
                  {!qrCodeUrl ? (
                    <div style={MUI.loadButtonBlock}>
                      <LoadingButton
                        disabled={qrCodeUrl ? true : false}
                        variant="contained"
                        color="inherit"
                        loading={loadCreateQr}
                        onClick={showQRcode}
                        sx={{ minWidth: 142 }}
                      >
                        Create QR Code
                      </LoadingButton>
                    </div>
                  ) : (
                    <img className={styles.QRimage} src={qrCodeUrl} alt="" />
                  )}
                </div>
              </div>
              <div>
                <Typography
                  component="h3"
                  sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                >
                  Verify Code:
                </Typography>
              </div>
              <div style={MUI.loadButtonBlock}>
                <TextField
                  autoFocus
                  required
                  inputRef={(input) => {
                    if (input != null) input.focus();
                  }}
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
              </div>
              <div style={MUI.loadButtonBlock}>
                <LoadingButton
                  disabled={disabled}
                  type="submit"
                  loading={loadSubmit}
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="inherit"
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

export default Enable2fa;
