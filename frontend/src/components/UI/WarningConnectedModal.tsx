import { useState, SetStateAction, Dispatch } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/material/Typography';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Box from '@mui/material/Box';
import * as MUI from './MUIstyles';

const WarningConnectedModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [load, setLoad] = useState(false);

  const handleClick = (): void => {
    setLoad(true);
    window.location.href = 'https://en.wikipedia.org/wiki/Pong';
  };

  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <Typography sx={MUI.modalHeader}> Attention!</Typography>
          <Box sx={MUI.warningBoxStyle}>
            <Typography>
              Gaming session is already running in another tab.
              <br />
              Please close this tab and return to the previously opened one to
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
                onClick={handleClick}
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

export default WarningConnectedModal;
