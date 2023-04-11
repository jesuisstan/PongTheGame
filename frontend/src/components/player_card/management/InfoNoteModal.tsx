import { SetStateAction, Dispatch } from 'react';
import { PlayerProfile } from '../../../types/PlayerProfile';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import * as MUI from '../../UI/MUIstyles';

const InfoNoteModal = ({
  open,
  setOpen,
  player
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  player: PlayerProfile;
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
            <Typography>Available actions:</Typography>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '21px'
              }}
            >
              <Typography>
                <Typography sx={{ fontWeight: 'Bold' }}>
                  Follow / Unfollow
                </Typography>
                : to conveniently monitor the status of this player.
              </Typography>
              <Typography>
                <Typography sx={{ fontWeight: 'Bold' }}>
                  Block / Unblock
                </Typography>
                : to avoid unnecessary messages or invitations from this player.
              </Typography>
              <Typography>
                <Typography sx={{ fontWeight: 'Bold' }}>Invite*</Typography>: to
                create customized game and invite this player to join it.
              </Typography>
              <Typography>
                <Typography sx={{ fontWeight: 'Bold' }}>Watch**</Typography>: to
                spectate current game of this player.
              </Typography>
            </div>
          </div>
          <Typography
            sx={{
              textAlign: 'left',
              fontSize: '14px',
              paddingTop: '15px',
              wordWrap: 'break-word'
            }}
          >
            <Typography>
              * Required player's status - ONLINE & UNBLOCKED.
            </Typography>
            <br />
            <Typography>** Required player's status - PLAYING.</Typography>
          </Typography>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InfoNoteModal;
