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
          <Typography sx={MUI.modalHeader}>Attention!</Typography>
          <Box sx={MUI.warningBoxStyle}>
            <Typography>
              You are not authorised yet.
              <br />
              That's why You can browse only Home and Info pages.
              <br />
              Please login to get access to Chat and Game pages.
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
                endIcon={<LoginIcon />}
                loadingPosition="end"
                variant="contained"
                color="inherit"
                onClick={handleDaccordClick}
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
