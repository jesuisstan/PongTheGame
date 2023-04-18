import {
  useState,
  useContext,
  SetStateAction,
  Dispatch,
  useEffect
} from 'react';
import { UserContext } from '../../contexts/UserContext';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/material/Typography';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import * as MUI from './MUIstyles';
import * as color from './colorsPong';

const URL_LOGOUT = `${process.env.REACT_APP_URL_BACKEND}/auth/logout`;
const TIME: number = 10;

const WarningTokenModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useContext(UserContext);
  const [load, setLoad] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(TIME);

  useEffect(() => {
    if (open) {
      const intervalId = setInterval(() => {
        setRemainingSeconds((prevRemainingSeconds) => prevRemainingSeconds - 1);
      }, 1000);

      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
      }

      setTimeout(() => {
        logout();
        setDefault();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [open]);

  const progress = (TIME - remainingSeconds) / TIME;

  const setDefault = () => {
    setLoad(false);
    setOpen(false);
  };

  const logout = () => {
    if (user.provider) {
      window.location.href = URL_LOGOUT;
    }
    setDefault();
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason === 'closeClick') {
            logout();
            setDefault();
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}> Attention!</Typography>
          <Box sx={MUI.warningBoxStyle}>
            <Typography> Current gaming session is almost over.</Typography>
            <Typography>You need to login again to continue.</Typography>
            <Typography>Auto redirect to login page in:</Typography>
            <CircularProgress
              variant="determinate"
              value={progress * 100 + 100}
              sx={{ color: color.PONG_PINK, marginTop: '10px' }}
            />
            <Typography>{remainingSeconds} sec.</Typography>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LoadingButton
                type="submit"
                loading={load}
                loadingPosition="end"
                endIcon={<ArrowForwardIosIcon />}
                variant="contained"
                color="inherit"
                onClick={() => logout()}
              >
                Proceed
              </LoadingButton>
            </div>
          </Box>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default WarningTokenModal;
