import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { User } from '../../types/User';
import { Player } from '../../types/Player';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import * as MUI from '../UI/MUIstyles';
import * as color from '../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const DEFAULT_WIN_SCORE = 3;

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

  const [loadSubmit, setLoadSubmit] = useState(false);
  const [buttonText, setButtonText] = useState('Invite');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const toggleObstacle = () => {
    setObstacleEnabled((prev) => !prev);
  };

  const inviteFriendsCustom = (nickname: string) => {
    // Send a socket to the back with info :
    // winscore
    // obstacle : true of false
    // Name of the people he invite

    // When the user press to button of the modal after selected the config of the game

    socket.emit('match_get_invitation', {
      winscore: 5,
      obstacle: false,
      nickname: nickname
    }); // The second argument is TMP
    // The other user is gonne get the notification on the request 'invitation_game' // He have to accept or decline the game
  };

  socket.on('match_invitation_error', (args) => {
    // If a error occurs
  });

  const handleTextInput = (event: any) => {
    const newValue = event.target.value;
    if (newValue.match(/[^0-9]/)) {
      setError('Only numbers acceptable');
    } else {
      setError('');
      setText(newValue);
    }
  };

  const verifyCurrentUser = async () => {
    try {
      const userData = (
        await backendAPI.post<User>('/auth/totp/verify', {
          token: text
        })
      ).data;
      setUser(userData);
    } catch (e) {
      setButtonText('Failed ❌');
    }
  };

  const submitCode = async () => {
    return backendAPI.post('/auth/totp/activate', { token: text }).then(
      (response) => {
        verifyCurrentUser();
        setButtonText('Done ✔️');
      },
      (error) => {
        setButtonText('Failed ❌');
        if (error?.response?.status === 400) {
          setTimeout(() => errorAlert('Invalid code'), 500);
        } else {
          setTimeout(() => errorAlert('Something went wrong'), 500);
        }
      }
    );
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoadSubmit(true);
    await submitCode();
    setLoadSubmit(false);
    setText('');
    setError('');
    setTimeout(() => setOpen(false), 442);
    setTimeout(() => setButtonText('Submit'), 450);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black', zIndex: 9999 }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') setOpen(false);
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
          {/*<form onSubmit={handleSubmit}>*/}
          <Stack spacing={2}>
            <div>
              <Typography
                component="h3"
                sx={{ color: color.PONG_BLUE, textAlign: 'center' }}
              >
                Define the winning score
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
                <FormControl
                  size="small"
                  sx={{
                    m: 0.5,
                    backgroundColor: 'whitesmoke',
                    width: 70,
                    border: '0px solid #f5f5f5ee',
                    borderRadius: '4px',
                    zIndex: 10000000
                  }}
                >
                  <Select
                    value={winScore ? winScore : 3}
                    onChange={(event) =>
                      setWinScore(event.target.value as number)
                    }
                    sx={{ zIndex: 11111 }}
                  >
                    <MenuItem value={3} sx={{ zIndex: 11111 }}>
                      <em>3</em>
                    </MenuItem>
                    <MenuItem value={5} sx={{ zIndex: 11111 }}>
                      5
                    </MenuItem>
                    <MenuItem value={11} sx={{ zIndex: 11111 }}>
                      11
                    </MenuItem>
                    <MenuItem value={21} sx={{ zIndex: 11111 }}>
                      21
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
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
                  title="change the map"
                  control={
                    <Switch
                      checked={obstacleEnabled}
                      onClick={() => toggleObstacle()}
                    />
                  }
                  label="On"
                />
              </div>
            </div>

            <LoadingButton
              type="submit"
              loading={loadSubmit}
              startIcon={<PlaylistAddCheckIcon />}
              variant="contained"
              color="inherit"
            >
              {buttonText}
            </LoadingButton>
          </Stack>
          {/*</form>*/}
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default InvitationModal;
