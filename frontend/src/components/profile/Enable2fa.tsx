import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { User } from '../../types/User';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import QRCode from 'qrcode';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import styles from './Profile.module.css';

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
      const user = (
        await backendAPI.post<User>('/auth/totp/verify', {
          token: text
        })
      ).data;
      console.log('user data after 2faVerification = ' + user)
      console.log(user)
      console.log('-----------')

      //setUser(user);

      // todo lines 82-85 to set user with totpSecret field while /auth/totp/verify doesn't returnes this field
      backendAPI.get('/auth/getuser').then((response) => {
        setUser(response.data);
      });
    } catch (e) {
      setButtonText('Failed to get user data');
    }
  };

  const submitCode = async () => {
    return backendAPI.post('/auth/totp/activate', { token: text }).then(
      (response) => {
        verifyCurrentUser();
        setButtonText('Done ✔️');
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
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoadSubmit(true);
    await submitCode();
    setLoadSubmit(false);
    setButtonText(
      user.totpSecret?.verified ? 'Done ✔️' : 'Failed ❌'
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
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            sx={{ color: 'black' }}
          >
            Setting up 2-Step Verification
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography component="h3" sx={{ color: 'rgb(37, 120, 204)' }}>
                Configuring Google Authenticator
              </Typography>
              <Stack spacing={1}>
                <li>
                  Install Google Authenticator:{' '}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=fr&gl=US"
                    target="_blank"
                    rel='noreferrer'
                  >
                    <img
                      className={styles.logo}
                      src={require('../../assets/androidLogo.png')}
                      alt=""
                    />
                  </a>{' '}
                  /{' '}
                  <a
                    href="https://apps.apple.com/fr/app/google-authenticator/id388497605"
                    target="_blank"
                    rel='noreferrer'
                  >
                    <img
                      className={styles.logo}
                      src={require('../../assets/appleLogo.png')}
                      alt=""
                    />
                  </a>
                </li>
                <li>In the authenticator app, select "+" icon</li>
                <li>
                  Select "Scan a QR code" and use the phone's camera to scan the
                  following QR code
                </li>
              </Stack>
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
