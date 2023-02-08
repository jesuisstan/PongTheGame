import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const URL_UPLOAD_AVATAR = 'http://localhost:3080/avatar/upload';

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5a6',
  borderRadius: '4px'
};

const EditAvatar = ({ user, open, setOpen }: any) => {
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
        const res = await axios.post(URL_UPLOAD_AVATAR, formData, {
          withCredentials: true,
          headers: { 'Content-type': 'multipart/form-data' }
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          showConfirmButton: false,
          icon: 'error',
          iconColor: '#fd5087',
          width: 450,
          title: 'Oops...',
          text: 'Something went wrong',
          showCloseButton: true,
          color: 'whitesmoke',
          background: 'black'
        });
      }
      setLoad(false);
      setButtonText('Done ✔️');
      console.log('new avatar uploaded');
      setTimeout(() => setOpen(false), 442);
      setTimeout(() => setButtonText('Submit'), 442);
    };
    uploadAvatar(formData);

    //axios
    //  .post(URL_UPLOAD_AVATAR, formData, {
    //    withCredentials: true,
    //    headers: { 'Content-type': 'multipart/form-data' }
    //  })
    //  .then(
    //    (response) => {
    //      console.log('new avatar uploaded');
    //    },
    //    (error) => {
    //      console.log(error.message);
    //      Swal.fire({
    //        showConfirmButton: false,
    //        icon: 'error',
    //        iconColor: '#fd5087',
    //        width: 450,
    //        title: 'Oops...',
    //        text: 'Something went wrong',
    //        showCloseButton: true,
    //        color: 'whitesmoke',
    //        background: 'black'
    //      });
    //    }
    //  );

    //axios({
    //  url: 'http://localhost:3080/avatar/upload',
    //  method: 'POST',
    //  headers: { 'Content-type': 'multipart/form-data' },
    //  data: formData,
    //  withCredentials: true
    //}).then(
    //  (response) => {
    //              console.log('new avatar uploaded');
    //  },
    //  (error) => {
    //    console.log(error.message);
    //    Swal.fire({
    //      showConfirmButton: false,
    //      icon: 'error',
    //      iconColor: '#fd5087',
    //      width: 450,
    //      title: 'Oops...',
    //      text: 'Something went wrong',
    //      showCloseButton: true,
    //      color: 'whitesmoke',
    //      background: 'black'
    //    });
    //  }
    //);
    setFile(undefined);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={(event, reason) => {
          if (event && reason == 'backdropClick') return;
          if (user.avatar) {
            setOpen(false);
          }
        }}
      >
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
            Modifying your avatar
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormLabel sx={{ color: 'black' }}>Max file size ...</FormLabel>
              <input
                required
                type="file"
                name="file"
                id="raised-button-file"
                accept="image/*,.png,.jpg,.gif,.web"
                onChange={handleInput}
              />
              <LoadingButton
                type="submit"
                loading={load}
                startIcon={<SaveIcon />}
                variant="contained"
                color="inherit"
              >
                {buttonText}
              </LoadingButton>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditAvatar;
