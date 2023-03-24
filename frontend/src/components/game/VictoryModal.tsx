import { SetStateAction, Dispatch } from 'react';
import { Game_status } from './game.interface';
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
  setGameState,
  winner,
  score
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setGameState: React.Dispatch<React.SetStateAction<Game_status>>;
  winner?: string;
  score?: any;
}) => {
  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            setGameState(Game_status.LOBBY);
            setOpen(false);
          }
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
            <Typography sx={{ color: 'black' }}>Final score -</Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VictoryModal;
