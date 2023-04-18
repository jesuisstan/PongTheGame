import { SetStateAction, Dispatch } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Box from '@mui/material/Box';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import * as MUI from '../../UI/MUIstyles';

const BlackNoteModal = ({
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
            Black List contains players been blocked by you.
            <br />
            Invitations to play game cannot be neither received from nor sent to
            blocked players.
          </Typography>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default BlackNoteModal;
