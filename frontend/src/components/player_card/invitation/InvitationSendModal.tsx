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
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const DEFAULT_WIN_SCORE = 5;

const InvitationSendModal = ({
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
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [buttonText, setButtonText] = useState('Invite');
  const [loading, setLoading] = useState(false);

  const toggleObstacle = () => {
    setObstacleEnabled((prev) => !prev);
  };

  const sendInvitation = () => {
    return new Promise(async (resolve, reject) => {
      socket.emit(
        'match_send_invitation',
        {
          winscore: winScore,
          obstacle: obstacleEnabled,
          nickname: player.nickname
        },
        (response: any) => {
          if (response.status === 400) {
            if (response.reason === 'Invitation already send') {
              reject((response.error = 'Invitation is already sent'));
            } else {
              reject((response.error = `${player.nickname} is occupied`));
            }
          } else if (response.status === 403) {
            reject(
              (response.error = `User with nickname "${player.nickname}" is not found`)
            );
          } else if (response.status !== 200) {
            reject((response.error = 'Something went wrong'));
          } else {
            resolve(response);
          }
        }
      );
    });
  };

  const setDefault = () => {
    setObstacleEnabled(false);
    setWinScore(DEFAULT_WIN_SCORE);
    setDisabledOptions(false);
    setDisabledButton(false);
    setButtonText('Invite');
    setLoading(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setDisabledOptions(true);
    setLoading(true);
    await sendInvitation()
      .then((data) => {
        setLoading(false);
        setButtonText('Awaiting');
        setDisabledButton(true);
        setLoading(true);
      })
      .catch((error) => {
        setDefault();
        setOpen(false);
        errorAlert(error);
      });
  };

  const cancelInvitation = () => {
    socket.emit('match_invitation_abort', {
      nickname: player.nickname
    });
  };

  //todo a socket_event kind of 'invitation_accepted' to proceed to game
  socket.on('invitation_accepted', (args) => {
    console.log('invitation_accepted');
    setLoading(false);
    // proceed to game //todo
    //setOpen(false);
  });

  socket.on('invitation_refused', (args) => {
    setLoading(false);
    setOpen(false);
    setDefault();
    errorAlert(`${player.nickname} refused your invitation`);
  });

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            cancelInvitation();
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
                  sx={{
                    textAlign: 'left',
                    paddingBottom: '10px',
                    paddingTop: '15px',
                    color: color.PONG_BLUE
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
                  <FormControlLabel
                    title="Add additional moving obstacle to the game"
                    control={
                      <SwitchPong
                        checked={obstacleEnabled}
                        disabled={disabledOptions}
                        onClick={() => toggleObstacle()}
                      />
                    }
                    label=""
                    labelPlacement="bottom"
                  />
                </div>
              </div>

              <div>
                <Typography
                  component="h3"
                  sx={{
                    textAlign: 'left',
                    paddingBottom: '30px',
                    color: color.PONG_BLUE
                  }}
                >
                  Define the win score:
                </Typography>
                <div
                  style={{
                    marginLeft: '15px',
                    marginRight: '15px'
                  }}
                >
                  <SliderPong
                    disabled={disabledOptions}
                    setWinScore={setWinScore}
                  />
                </div>
              </div>
              <div>
                <Typography
                  component="h3"
                  sx={{
                    textAlign: 'left',
                    paddingBottom: '10px',
                    paddingTop: '15px',
                    color: color.PONG_BLUE
                  }}
                >
                  Send invitation and wait for response:
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <LoadingButton
                    type="submit"
                    title={`Invite ${player.nickname} to play game`}
                    loading={loading}
                    endIcon={
                      buttonText === 'Sent' ? (
                        <PlaylistAddCheckIcon />
                      ) : (
                        <SendIcon />
                      )
                    }
                    variant="contained"
                    color="inherit"
                    loadingPosition="end"
                    disabled={disabledButton}
                    sx={{ minWidth: '130px' }}
                  >
                    {buttonText}
                  </LoadingButton>
                </div>
              </div>
              <Typography
                sx={{
                  textAlign: 'left',
                  fontSize: '14px'
                }}
              >
                * closing this popup will cancel the invitation
              </Typography>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationSendModal;
