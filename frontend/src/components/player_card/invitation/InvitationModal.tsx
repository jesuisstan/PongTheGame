import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { User } from '../../../types/User';
import { Player } from '../../../types/Player';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import SliderPong from './SliderPong';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SwitchPong from './SwitchPong';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import SendIcon from '@mui/icons-material/Send';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const DEFAULT_WIN_SCORE = 5;

const InvitationModal = ({
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
  const [obstacleEnabled, setObstacleEnabled] = useState(false);
  const [winScore, setWinScore] = useState(DEFAULT_WIN_SCORE);
  const [disabled, setDisabled] = useState(false);
  const [loadingInvitation, setLoadingInvitation] = useState(false);
  const [buttonInviteText, setButtonInviteText] = useState('Invite');

  const toggleObstacle = () => {
    setObstacleEnabled((prev) => !prev);
  };

  const sendInvitation = () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
          socket.emit('match_get_invitation', {
            winscore: winScore,
            obstacle: obstacleEnabled,
            nickname: player.nickname
          });
          setLoadingInvitation(false);
          setButtonInviteText('Sent');
          resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  socket.on('match_invitation_error', (args) => { // If a error occurs
    // If a error occurs
    //setLoading(false)
    //setButtonText('Failed ❌')
    console.log('socket match_invitation_error ON');
    console.log(args);
  });

  const setDefault = () => {
    setDisabled(false);
    setObstacleEnabled(false);
    setButtonInviteText('Invite');
    setLoadingInvitation(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setDisabled(true);
    setLoadingInvitation(true);
    await sendInvitation()
      .then(() => {
        //setTimeout(() => setOpen(false), 442);
        //setTimeout(() => setDefault(), 450);
      })
      .catch((error) => {
        errorAlert(error);
        setDefault();
      });
  };


  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
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
            Setting up custom game
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <div>
                <Typography
                  component="h3"
                  sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                >
                  Define if obstacle available
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
                  <Typography>Off</Typography>
                  <FormControlLabel
                    title="Add additional moving obstacle to the game"
                    control={
                      <SwitchPong
                        checked={obstacleEnabled}
                        disabled={disabled}
                        onClick={() => toggleObstacle()}
                      />
                    }
                    label="On"
                  />
                </div>
              </div>

              <div>
                <Typography
                  component="h3"
                  sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
                >
                  Define the winning score
                </Typography>
                <SliderPong disabled={disabled} setWinScore={setWinScore} />
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
<div style={{display:'flex', flexDirection: 'row', gap: '21px', alignItems: 'center', justifyItems: 'center'}}>

              <LoadingButton
                type="submit"
                loading={loadingInvitation}
                endIcon={
                  buttonInviteText === 'Sent' ? (
                    <PlaylistAddCheckIcon />
                  ) : (
                    <SendIcon />
                  )
                }
                variant="contained"
                color="inherit"
                loadingIndicator="Sending..."
                disabled={buttonInviteText === 'Sent' ? true : false}
              >
                {buttonInviteText}
              </LoadingButton>

              <LoadingButton
                type="submit"
                loading={!loadingInvitation}
                endIcon={
                  buttonInviteText === 'Sent' ? (
                    <PlaylistAddCheckIcon />
                  ) : (
                    <SendIcon />
                  )
                }
                variant="contained"
                color="inherit"
                loadingIndicator="Waiting..."
                disabled={buttonInviteText === 'Sent' ? false : true}
              >
                {buttonInviteText}
              </LoadingButton>
</div>

            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationModal;
