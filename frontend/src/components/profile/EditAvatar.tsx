import { useState, useContext, SetStateAction, Dispatch } from 'react';
import { UserContext } from '../../contexts/UserContext';
import errorAlert from '../UI/errorAlert';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import backendAPI from '../../api/axios-instance';
import * as MUI from '../UI/MUIstyles';

const EditAvatar = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setUser } = useContext(UserContext);
  const [file, setFile] = useState<File>();
  const [load, setLoad] = useState(false);
  const [buttonText, setButtonText] = useState('Submit');

  const handleInput = (event: React.FormEvent) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('file', file!);

    const uploadAvatar = async (formData: FormData) => {
      setLoad(true);
      try {
        const responseUpload = await backendAPI.post(
          '/avatar/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        setUser(responseUpload.data);
      } catch (error) {
        setOpen(false);
        const message =
          (error as any)?.response?.data?.message ?? 'Something went wrong';
        errorAlert(message);
      }
      setLoad(false);
      setButtonText('Done ✔️');
      setTimeout(() => setOpen(false), 442);
      setTimeout(() => setButtonText('Submit'), 442);
    };
    uploadAvatar(formData);
    setFile(undefined);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
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
          <Typography sx={MUI.modalHeader}>Change avatar</Typography>
          <form style={{ marginTop: '10px' }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FormLabel sx={{ color: 'black' }}>
                  Maximum file size is 2 Mb
                </FormLabel>
              </Box>
              <input
                required
                type="file"
                name="file"
                id="raised-button-file"
                accept="image/*,.png,.jpg,.gif,.web"
                onChange={handleInput}
              />
              <div style={MUI.loadButtonBlock}>
                <LoadingButton
                  type="submit"
                  loading={load}
                  startIcon={<SaveIcon />}
                  variant="contained"
                  color="inherit"
                  sx={{ minWidth: 142, borderRadius: '90px' }}
                >
                  {buttonText}
                </LoadingButton>
              </div>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditAvatar;
