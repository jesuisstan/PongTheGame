import { SetStateAction, Dispatch } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import * as MUI from '../../UI/MUIstyles';

const HistoryNoteModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal sx={{ color: 'black' }} open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        aria-labelledby="basic-modal-dialog-title"
        sx={MUI.modalDialog}
      >
        <ModalClose sx={MUI.modalClose} />
        <Typography sx={MUI.modalHeader}>Note</Typography>
        <Box sx={MUI.warningBoxStyle}>
          <Typography>
            Match history includes{' '}
            <span style={{ fontWeight: 'bold' }}>online</span> games played.
            <br />
            Training with AI does not come into count.
          </Typography>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default HistoryNoteModal;
