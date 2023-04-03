import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { User } from '../../../types/User';
import { Player } from '../../../types/Player';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const InvitationReceivedModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, setUser } = useContext(UserContext);
  const socket = useContext(WebSocketContext);
  const [disabledButton, setDisabledButton] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingPlay, setLoadingPlay] = useState(false);

  //const sendInvitation = () => {
  //  return new Promise(async (resolve, reject) => {
  //    socket.emit(
  //      'match_get_invitation',
  //      {
  //        winscore: winScore,
  //        obstacle: obstacleEnabled,
  //        nickname: player.nickname
  //      },
  //      (response: any) => {
  //        console.log(response);
  //        if (response.error) {
  //          reject(response.error);
  //        } else {
  //          setLoadingInvite(false);
  //          setButtonInviteText('Sent');
  //          setDisabledButton(true);
  //          resolve(response.data);
  //        }
  //      }
  //    );
  //  });
  //};

  const declineInvitation = () => {
    console.log('declined');
  };

  const acceptInvitation = () => {
    console.log('accepted');
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
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
          <Stack spacing={3}>
            <div>
              <Typography
                component="h3"
                sx={{
                  textAlign: 'center',
                  paddingBottom: '10px',
                  paddingTop: '15px'
                }}
              >
                Define if obstacle is available:
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '11px',
                  justifyContent: 'center'
                }}
              ></div>
            </div>

            <div>
              <Typography
                component="h3"
                sx={{ textAlign: 'center', paddingBottom: '30px' }}
              >
                Someone invites your to play the custom game:
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '11px',
                  justifyContent: 'center'
                }}
              >
                Obstacle - ; win score - ;
              </div>
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
                  loading={loadingInvite}
                  startIcon={<HighlightOffIcon />}
                  variant="contained"
                  color="inherit"
                  loadingPosition="start"
                  sx={{ minWidth: '100px' }}
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
                  sx={{ minWidth: '100px' }}
                  onClick={() => acceptInvitation()}
                >
                  Play
                </LoadingButton>
              </div>
            </div>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationReceivedModal;
