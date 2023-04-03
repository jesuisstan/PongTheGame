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
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [buttonInviteText, setButtonInviteText] = useState('Invite');
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingPlay, setLoadingPlay] = useState(false);

  const toggleObstacle = () => {
    setObstacleEnabled((prev) => !prev);
  };

  const sendInvitation = () => {
    return new Promise(async (resolve, reject) => {
      socket.emit(
        'match_get_invitation',
        {
          winscore: winScore,
          obstacle: obstacleEnabled,
          nickname: player.nickname
        },
        (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            setLoadingInvite(false);
            setButtonInviteText('Sent');
            setDisabledButton(true);
            resolve(response.data);
          }
        }
      );
    });
  };

  socket.on('match_invitation_error', (args) => {
    // If a error occurs
    console.log('socket match_invitation_error ON');
    console.log(args);
  });

  const setDefault = () => {
    setDisabledOptions(false);
    setObstacleEnabled(false);
    setButtonInviteText('Invite');
    setLoadingInvite(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setDisabledOptions(true);
    setLoadingInvite(true);
    await sendInvitation()
      .then((data) => {
        console.log('resp emit data -> ', data);
        setLoadingPlay(true);
      })
      .catch((error) => {
        setDefault();
        setOpen(false);
        errorAlert(error);
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
                  sx={{ textAlign: 'center', paddingBottom: '30px' }}
                >
                  Define the win score:
                </Typography>
                <SliderPong
                  disabled={disabledOptions}
                  setWinScore={setWinScore}
                />
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
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationModal;
