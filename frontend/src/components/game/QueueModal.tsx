import { useContext } from 'react';
import Typography from '@mui/joy/Typography';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { Game_status } from './game.interface';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';

const modalDialogStyle = {
  width: 'auto',
  maxWidth: '442px',
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
  borderRadius: '4px'
};

interface QueueModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGameState: (gameState: Game_status) => void;
}

const QueueModal = (props: QueueModalProps) => {
  const socket = useContext(WebSocketContext);

  const exitQueue = () => {
    props.setGameState(Game_status.LOBBY);
    socket.emit('match_making', { action: 'cancel' });
    props.setOpen(false);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={props.open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            exitQueue();
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={modalDialogStyle}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>
            Waiting for the opponent...
          </Typography>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <CircularProgress
              sx={{ color: color, marginTop: '10px' }}
            />
            <LoadingButton
              type="reset"
              endIcon={<NotInterestedIcon />}
              variant="contained"
              color="inherit"
              onClick={exitQueue}
            >
              cancel
            </LoadingButton>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default QueueModal;
