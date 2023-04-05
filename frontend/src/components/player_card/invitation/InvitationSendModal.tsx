import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { GameStateContext } from '../../../contexts/GameStateContext';
import { GameStatus } from '../../game/game.interface';
import { PlayerProfile } from '../../../types/PlayerProfile';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import SliderPong from './SliderPong';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SwitchPong from './SwitchPong';
import FormControlLabel from '@mui/material/FormControlLabel';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';

const DEFAULT_WIN_SCORE = 5;

const InvitationSendModal = ({
  open,
  setOpen,
  player
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  player: PlayerProfile;
}) => {
  const navigate = useNavigate();
  const { setGameState } = useContext(GameStateContext);
  const socket = useContext(WebSocketContext);
  const [obstacleEnabled, setObstacleEnabled] = useState(false);
  const [winScore, setwinScore] = useState(DEFAULT_WIN_SCORE);
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [buttonText, setButtonText] = useState('Invite');
  const [loading, setLoading] = useState(false);

  const setDefault = () => {
    setObstacleEnabled(false);
    setwinScore(DEFAULT_WIN_SCORE);
    setDisabledOptions(false);
    setDisabledButton(false);
    setButtonText('Invite');
    setLoading(false);
  };

  const toggleObstacle = () => {
    setObstacleEnabled((prev) => !prev);
  };

  const sendInvitation = () => {
    return new Promise(async (resolve, reject) => {
      socket.emit(
        'match_send_invitation',
        {
          winScore: winScore,
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

  socket.on('invitation_accepted', (args) => {
    console.log('invitation_accepted');
    setButtonText('Accepted');
    setLoading(false);
    setOpen(false);
    navigate('/game');
    setGameState(GameStatus.BEGIN_GAME);
  });

  socket.on('invitation_refused', (args) => {
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
                    setwinScore={setwinScore}
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
                      buttonText === 'Accepted' ? (
                        <CheckCircleOutlineIcon />
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
