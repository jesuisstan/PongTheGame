import { SetStateAction, Dispatch } from 'react';
import { Game_status, Game_result } from './game.interface';
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
  gameResult
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setGameState: React.Dispatch<React.SetStateAction<Game_status>>;
  gameResult: Game_result | null;
}) => {
  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={() => {
          setGameState(Game_status.LOBBY);
          setOpen(false);
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
              {gameResult?.winner.name} won the round
            </Typography>
            <Typography sx={{ color: 'black' }}>
              Final score - {gameResult?.winner.score} :{' '}
              {gameResult?.loser.score}{' '}
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VictoryModal;
