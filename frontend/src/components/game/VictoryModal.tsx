import { SetStateAction, Dispatch } from 'react';
import { Game_status, Game_result } from './game.interface';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import styles from './Game.module.css';

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
            sx={{ color: 'black', textAlign: 'center' }}
          >
            Game over!
          </Typography>
          <Stack spacing={2}>
            <Typography sx={{ color: 'black', textAlign: 'center' }}>
              {gameResult?.winner.name} won the round
            </Typography>
            <Typography sx={{ color: 'black', textAlign: 'center' }}>Final score:</Typography>
            <Typography sx={{ color: 'black', textAlign: 'center' }}>
              <img
                className={styles.ava}
                src={gameResult?.winner.avatar}
                alt=""
              />{' '}
              {gameResult?.winner.score} : {gameResult?.loser.score}{' '}
              <img
                className={styles.ava}
                src={gameResult?.loser.avatar}
                alt=""
              />
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VictoryModal;
