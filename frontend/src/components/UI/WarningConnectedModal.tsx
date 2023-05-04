import { useState, SetStateAction, Dispatch } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

  const handleLogoutClick = (): void => {
    setLoad(true);
    localStorage.removeItem('logStatus');
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
              A session is currently active in another tab,
              <br />
              so please go back to it to continue.
            </Typography>

            <Typography>
              If this notification persists, relogin* to remove it.
            </Typography>
            <div style={MUI.loadButtonBlock}>
              <LoadingButton
                type="submit"
                loading={load}
                endIcon={<ExitToAppIcon />}
                loadingPosition="end"
                variant="contained"
                color="inherit"
                onClick={handleLogoutClick}
                sx={{ minWidth: 142 }}
              >
                Relogin
              </LoadingButton>
            </div>
          </Box>
          <Typography
            sx={{
              textAlign: 'left',
              fontSize: '14px',
              paddingTop: '15px',
              wordWrap: 'break-word'
            }}
          >
            * this will end the session in current browser
          </Typography>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default WarningConnectedModal;
