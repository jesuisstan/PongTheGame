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
import SendIcon from '@mui/icons-material/Send';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const InvitationReceivedModal = ({
  open,
  setOpen,
  player
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  player: Player;
}) => {
  const { user, setUser } = useContext(UserContext);
  const socket = useContext(WebSocketContext);
  const [disabledButton, setDisabledButton] = useState(false);
  const [buttonInviteText, setButtonInviteText] = useState('Invite');
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
            Setting up custom game
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
                >
                  
                </div>
              </div>

              <div>
                <Typography
                  component="h3"
                  sx={{ textAlign: 'center', paddingBottom: '30px' }}
                >
                  Define the win score:
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
                    title={`Invite ${player.nickname} to play game`}
                    loading={loadingInvite}
                    endIcon={
                      buttonInviteText === 'Sent' ? (
                        <PlaylistAddCheckIcon />
                      ) : (
                        <SendIcon />
                      )
                    }
                    variant="contained"
                    color="inherit"
                    loadingPosition="end"
                    disabled={disabledButton}
                    sx={{ minWidth: '100px' }}
                  >
                    {buttonInviteText}
                  </LoadingButton>
                </div>
                <div>
                  <LoadingButton
                    type="submit"
                    title="Proceed to game"
                    loading={loadingPlay}
                    endIcon={
                      buttonInviteText === 'Sent' ? (
                        <PlaylistAddCheckIcon />
                      ) : (
                        <SportsEsportsIcon />
                      )
                    }
                    variant="contained"
                    color="inherit"
                    loadingPosition="end"
                    disabled={!disabledButton}
                    sx={{ minWidth: '100px' }}
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
