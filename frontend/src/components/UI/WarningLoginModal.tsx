import { useState, SetStateAction, Dispatch } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import ModalClose from '@mui/joy/ModalClose';
import * as MUI from './MUIstyles';

const WarningLoginModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const handleDaccordClick = (): void => {
    setLoad(true);
    setOpen(false);
    navigate('/login');
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={() => {
          setLoad(false);
          setOpen(false);
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>Salut!</Typography>
          <Box sx={MUI.warningBoxStyle}>
            <Typography>
              You are not authorised yet.
              <br />
              Please login to get access to Profile & Game.
            </Typography>
            <div style={MUI.loadButtonBlock}>
              <LoadingButton
                type="submit"
                loading={load}
                endIcon={<LoginIcon />}
                loadingPosition="end"
                variant="contained"
                color="inherit"
                onClick={handleDaccordClick}
                sx={{ minWidth: 142, borderRadius: '90px' }}
              >
                D'Accord
              </LoadingButton>
            </div>
          </Box>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default WarningLoginModal;
