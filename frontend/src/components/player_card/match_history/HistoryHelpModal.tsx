import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { Achievement } from '../../../types/Achievement';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';

const HistoryHelpModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>Explanatory note</Typography>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <Typography>
              Match history includes only online games played.
            </Typography>
            <Typography>Training with AI does not count.</Typography>
          </div>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default HistoryHelpModal;
