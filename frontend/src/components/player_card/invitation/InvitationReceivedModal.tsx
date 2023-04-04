import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { User } from '../../../types/User';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import { Invitation } from '../../../types/Invitation';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Avatar from '@mui/material/Avatar';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const InvitationReceivedModal = ({
  open,
  setOpen,
  invitation
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  invitation: Invitation;
}) => {
  const { user, setUser } = useContext(UserContext);
  const socket = useContext(WebSocketContext);
  const [loadingDecline, setLoadingDecline] = useState(false);
  const [loadingPlay, setLoadingPlay] = useState(false);

  const declineInvitation = () => {
    console.log('declined');
    socket.emit('match_invitation_abort', {
      nickname: invitation.from.nickname
    });
    setOpen(false);
  };

  const acceptInvitation = () => {
    console.log('accepted');

    socket.emit('match_invitation_accept', {
      winscore: invitation.gameInfo.winscore,
      obstacle: invitation.gameInfo.obstacle,
      nickname: invitation.from.nickname
    });
    setOpen(false);
  };

  const setDefault = () => {
    setLoadingDecline(false);
    setLoadingPlay(false);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            declineInvitation();
            setDefault();
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography id="basic-modal-dialog-title" sx={MUI.modalHeader}>
            Invitation received!
          </Typography>
          <Stack spacing={2}>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Avatar
                  alt=""
                  src={invitation.from.avatar}
                  sx={{
                    width: 50,
                    height: 50,
                    ':hover': {
                      cursor: 'pointer'
                    }
                  }}
                  title={invitation.from.nickname}
                  onClick={() =>
                    window.open(
                      `/players/${invitation.from.nickname}`,
                      '_blank'
                    )
                  }
                />
                Player {invitation.from.nickname}
              </div>
              <Typography
                sx={{
                  textAlign: 'center',
                  whiteSpace: 'pre'
                }}
              >
                invites your to play game{'\n'}
                with customisation:
              </Typography>
            </div>

            <div>
              <Typography
                sx={{
                  textAlign: 'center',
                  whiteSpace: 'pre'
                }}
              >
                win score - [ {invitation.gameInfo.winscore} ]{'\n'}moving
                obstacle - [ {invitation.gameInfo.obstacle ? 'on' : 'off'} ]
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '21px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div>
                <LoadingButton
                  type="submit"
                  loading={loadingDecline}
                  startIcon={<HighlightOffIcon />}
                  variant="contained"
                  color="inherit"
                  loadingPosition="start"
                  sx={{ minWidth: '120px' }}
                  onClick={() => declineInvitation()}
                >
                  Decline
                </LoadingButton>
              </div>
              <div>
                <LoadingButton
                  type="submit"
                  title="Proceed to game"
                  loading={loadingPlay}
                  startIcon={<SportsEsportsIcon />}
                  variant="contained"
                  color="inherit"
                  loadingPosition="start"
                  sx={{ minWidth: '120px' }}
                  onClick={() => acceptInvitation()}
                >
                  Play
                </LoadingButton>
              </div>
            </div>
            <Typography
              sx={{
                textAlign: 'left',
                fontSize: '14px',
                paddingTop: '15px'
              }}
            >
              * closing this popup will decline the invitation
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationReceivedModal;
