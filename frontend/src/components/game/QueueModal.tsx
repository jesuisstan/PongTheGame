import { useContext } from 'react';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { GameStatus } from './game.interface';
import { GameStatusContext } from '../../contexts/GameStatusContext';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
}

const QueueModal = (props: QueueModalProps) => {
  const { setGameStatus } = useContext(GameStatusContext);
  const socket = useContext(WebSocketContext);

  const exitQueue = () => {
    setGameStatus(GameStatus.LOBBY);
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
          <Typography sx={MUI.modalHeader}>Awaiting acceptance...</Typography>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <CircularProgress
              sx={{ color: color.PONG_PINK, marginTop: '10px' }}
            />
            <div style={MUI.loadButtonBlock}>
              <LoadingButton
                type="reset"
                startIcon={<HighlightOffIcon />}
                variant="contained"
                color="inherit"
                onClick={exitQueue}
                sx={{ minWidth: 142 }}
              >
                cancel
              </LoadingButton>
            </div>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default QueueModal;
