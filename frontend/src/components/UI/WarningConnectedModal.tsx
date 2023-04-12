import { useState, SetStateAction, Dispatch } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import * as MUI from './MUIstyles';

const URL_LOGOUT = `${process.env.REACT_APP_URL_BACKEND}/auth/logout`;

const WarningConnectedModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [load, setLoad] = useState(false);

  const handleDaccordClick = (): void => {
    setLoad(true);
    window.location.href = 'https://en.wikipedia.org/wiki/Pong';
  };

  const handleLogoutClick = (): void => {
    setLoad(true);
    window.location.href = URL_LOGOUT;
  };

  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <Typography sx={MUI.modalHeader}>Attention!</Typography>
          <Box sx={MUI.warningBoxStyle}>
            <Typography>
              Gaming session is already running in another tab or web browser.
              <br />
              Please close this page and return to the previously opened one to
              continue.
            </Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LoadingButton
                type="submit"
                loading={load}
                endIcon={<ThumbUpOffAltIcon />}
                loadingPosition="end"
                variant="contained"
                color="inherit"
                onClick={handleDaccordClick}
              >
                D'Accord
              </LoadingButton>
            </div>
            <Typography>
              Or just logout to get rid of this notification.
              <br />
              (this will end the session in current browser)
            </Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LoadingButton
                type="submit"
                loading={load}
                endIcon={<ExitToAppIcon />}
                loadingPosition="end"
                variant="contained"
                color="inherit"
                onClick={handleLogoutClick}
              >
                Logout
              </LoadingButton>
            </div>
          </Box>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default WarningConnectedModal;
