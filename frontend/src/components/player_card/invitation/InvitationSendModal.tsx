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
  const [buttonInviteText, setButtonInviteText] = useState('Invite');
  const [buttonPlayText, setButtonPlayText] = useState('Play');
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingPlay, setLoadingPlay] = useState(false);

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
          console.log(response); //todo
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
            console.log('goodway'); //todo
            resolve(response);
          }
        }
      );
    });
  };

  socket.on('match_invitation_error', (args) => {
    // If a error occurs
    // If a error occurs
    console.log('socket match_invitation_error ON');
    console.log(args);
  });

  const setDefault = () => {
    setDisabledOptions(false);
    setObstacleEnabled(false);
    setButtonInviteText('Invite');
    setLoadingInvite(false);
    setButtonPlayText('Play');
    setLoadingPlay(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setDisabledOptions(true);
    setLoadingInvite(true);
    await sendInvitation()
      .then((data) => {
        console.log('resp emit data -> ', data);
        setLoadingInvite(false);
        setButtonInviteText('Sent');
        setDisabledButton(true);
        setButtonPlayText('Awaiting');
        setLoadingPlay(true);
      })
      .catch((error) => {
        setDefault();
        setOpen(false);
        errorAlert(error);
      });
  };

  const cancelInvitation = () => {
    console.log('cancel Invit');
    socket.emit('match_invitation_abort', {
      nickname: player.nickname
    });
  };

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
                  Send invitation and proceed to game:
                </Typography>
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
                      sx={{ minWidth: '130px' }}
                    >
                      {buttonInviteText}
                    </LoadingButton>
                  </div>
                  <div>
                    <LoadingButton
                      type="submit"
                      title="Proceed to game"
                      loading={loadingPlay}
                      endIcon={<SportsEsportsIcon />}
                      variant="contained"
                      color="inherit"
                      loadingPosition="end"
                      disabled={!disabledButton}
                      sx={{ minWidth: '130px' }}
                    >
                      {buttonPlayText}
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
                  * closing this popup cancels an invitation
                </Typography>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationSendModal;
