import { SetStateAction, Dispatch } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
  borderRadius: '4px'
};

const VictoryModal = ({
  open,
  setOpen,
  winner,
  score,
  setDefault
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  winner: string;
  score: any;
  setDefault: any
}) => {
  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {setDefault(); setOpen(false)};
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
            Game over!
          </Typography>
          <Stack spacing={2}>
            <Typography sx={{ color: 'black' }}>
              {winner} won the round
            </Typography>
            <Typography sx={{ color: 'black' }}>
              Final score - {score.player1} : {score.player2}
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VictoryModal;
