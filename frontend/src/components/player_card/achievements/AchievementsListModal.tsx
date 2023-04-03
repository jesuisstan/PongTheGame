import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { Achievement } from '../../../types/Achievement';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import * as MUI from '../../UI/MUIstyles';
import * as color from '../../UI/colorsPong';

const AchievementsListModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    backendAPI.get(`/achievements`).then(
      (response) => {
        setAchievements(response.data);
      },
      (error) => {
        errorAlert('Failed to get possible achievements data');
      }
    );
  }, []);

  return (
    <div>
      <Modal sx={{ color: 'black' }} open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={MUI.modalDialog}
        >
          <ModalClose sx={MUI.modalClose} />
          <Typography sx={MUI.modalHeader}>Possible achievements:</Typography>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {achievements.map((item, index) => (
              <Typography key={item.id}>
                {index + 1}.{' '}
                <Typography sx={{ color: color.PONG_PINK }}>
                  "{item.Name}".{' '}
                  <Typography sx={{ color: 'black' }}>
                    {item.Description}.
                  </Typography>
                </Typography>
              </Typography>
            ))}
          </div>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default AchievementsListModal;
