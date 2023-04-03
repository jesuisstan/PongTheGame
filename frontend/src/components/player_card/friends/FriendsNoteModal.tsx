import { SetStateAction, Dispatch } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Player } from '../../../types/Player';
import Typography from '@mui/joy/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import BadgePong from '../../UI/BadgePong';
import Avatar from '@mui/material/Avatar';

const FriendsNoteModal = ({
  open,
  setOpen,
  player
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  player: Player;
}) => {
  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>Note</Typography>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <Typography>Friends status:</Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '21px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '21px'
                }}
              >
                <div>
                  <BadgePong player={player} color={'green'} pulse={true}>
                    <Avatar></Avatar>
                  </BadgePong>
                </div>
                <Typography sx={{ marginTop: '8px' }}>- online</Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '21px'
                }}
              >
                <div>
                  <BadgePong
                    player={player}
                    color={color.PONG_BLUE}
                    pulse={true}
                  >
                    <Avatar></Avatar>
                  </BadgePong>
                </div>
                <Typography sx={{ marginTop: '8px' }}>- playing</Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '21px'
                }}
              >
                <div>
                  <BadgePong player={player} color={'red'} pulse={false}>
                    <Avatar></Avatar>
                  </BadgePong>
                </div>
                <Typography sx={{ marginTop: '8px' }}>- offline</Typography>
              </div>
            </div>
          </div>
          <Typography
            sx={{
              textAlign: 'left',
              fontSize: '14px',
              paddingTop: '15px',
              whiteSpace: 'pre'
            }}
          >
            * Friends status refreshes automatically.{'\n'}
            ** To refrash Friends list use <RefreshIcon /> button.
          </Typography>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default FriendsNoteModal;
