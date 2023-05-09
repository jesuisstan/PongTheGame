import { useState, SetStateAction, Dispatch } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import * as MUI from './MUIstyles';
import { backendUrl } from '../../api/axios-instance';

const URL_LOGOUT = `${backendUrl}/auth/logout`;

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
              If this notification persists, you have exceeded the number of
              logins per session.
              <br />
              Logout and return back 30 seconds later.
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
