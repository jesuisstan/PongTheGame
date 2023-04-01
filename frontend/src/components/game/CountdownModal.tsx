import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/joy/Typography';
import { Game_player, Game_status } from './game.interface';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';

const modalDialogStyle = {
  width: 'auto',
  maxWidth: '442px',
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
  borderRadius: '4px'
};

interface CountdownProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  players: Game_player[];
  setGameState: (gameState: Game_status) => void;
  seconds: number;
}

const CountdownModal = (props: CountdownProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    props.seconds
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingSeconds((prevRemainingSeconds) => prevRemainingSeconds - 1);
    }, 1000);

    if (remainingSeconds === 1) {
    }
    if (remainingSeconds === 0) {
      props.setGameState(Game_status.PLAYING);
      props.setOpen(false);
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [remainingSeconds]);

  const progress = (props.seconds - remainingSeconds) / (props.seconds - 1);

  return (
    <div>
      <Modal sx={{ color: 'black' }} open={props.open}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={modalDialogStyle}
        >
          <Typography sx={MUI.modalHeader}>Game starts in...</Typography>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <CircularProgress
              variant="determinate"
              value={progress * 100}
              sx={{ color: color.PONG_PINK, marginTop: '10px' }}
            />
            <Typography>{remainingSeconds - 1} sec.</Typography>
            <Typography
              textAlign="center"
              sx={{
                whiteSpace: 'pre'
              }}
            >
              Use <KeyboardArrowUpIcon sx={{ color: color.PONG_PINK }} /> and{' '}
              <KeyboardArrowDownIcon sx={{ color: color.PONG_PINK }} /> keys{' '}
              {'\n'}
              to move the paddle
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default CountdownModal;
