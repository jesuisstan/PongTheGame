import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5ee',
  borderRadius: '4px'
};

const AchievementsListModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [achievements, setAchievements] = useState(
    Array<{ id: -1; Name: ''; Description: '' }>
  );

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
          sx={modalDialogStyle}
        >
          <ModalClose />
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            sx={{ color: 'black' }}
          >
            Possible achievements:
          </Typography>
          {achievements.map((item, index) => (
            <Typography key={item.id}>
              {index + 1}.{' '}
              <Typography sx={{ color: 'rgb(37, 120, 204)' }}>
                "{item.Name}".{' '}
                <Typography sx={{ color: 'black' }}>
                  {item.Description}.
                </Typography>
              </Typography>
            </Typography>
          ))}
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default AchievementsListModal;
