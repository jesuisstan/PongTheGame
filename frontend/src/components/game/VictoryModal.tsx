import { useNavigate } from 'react-router-dom';
import { SetStateAction, Dispatch, useContext } from 'react';
import { GameStatus, GameResult } from './game.interface';
import { GameStateContext } from '../../contexts/GameStateContext';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';
import styles from './styles/VictoryModal.module.css';

const VictoryModal = ({
  open,
  setOpen,
  gameResult
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  gameResult: GameResult | null;
}) => {
  const navigate = useNavigate();
  const { setGameState } = useContext(GameStateContext);

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (
            event &&
            (reason === 'closeClick' || reason === 'escapeKeyDown')
          ) {
            setGameState(GameStatus.LOBBY);
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>Game over!</Typography>
          <Stack spacing={2}>
            {gameResult?.reason === 'Player left the game' && (
              <Typography
                sx={{
                  color: 'black',
                  textAlign: 'center',
                  marginTop: '10px',
                  whiteSpace: 'pre'
                }}
              >
                <WarningAmberIcon
                  fontSize="large"
                  sx={{ color: color.PONG_PINK }}
                />
                {'\n'}
                {gameResult?.loser.name} left the game {'\n'}
                and receives technical lose
              </Typography>
            )}
            <Typography
              sx={{ color: 'black', textAlign: 'center', marginTop: '10px' }}
            >
              {gameResult?.winner.name
                ? gameResult?.winner.name
                : 'AI'}{' '}
              wins the round
            </Typography>
            <div className={styles.scoreBlock}>
              <Avatar
                alt=""
                src={gameResult?.winner.avatar}
                sx={{
                  width: 50,
                  height: 50,
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                title={gameResult?.winner.name}
                onClick={() => {
                  if (gameResult?.winner?.name) {
                    navigate(`/players/${gameResult.winner.name}`);
                  }
                }}
              />
              {gameResult?.winner.score} : {gameResult?.loser.score}
              <Avatar
                alt=""
                src={gameResult?.loser.avatar}
                sx={{
                  width: 50,
                  height: 50,
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                title={gameResult?.loser.name}
                onClick={() => {
                  if (gameResult?.loser?.name) {
                    navigate(`/players/${gameResult.loser.name}`);
                  }
                }}
              />
            </div>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VictoryModal;
