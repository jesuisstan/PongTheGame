import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const urlUploadAvatar = 'http://localhost:3080/avatar/upload';

const EditAvatar = ({ user, open, setOpen }: any) => {
  const [file, setFile] = useState<File>();

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

    axios
      .post(urlUploadAvatar, formData, {
        withCredentials: true,
        headers: { 'Content-type': 'multipart/form-data' }
      })
      .then(
        (response) => {
          console.log('new avatar uploaded');
        },
        (error) => {
          console.log(error.message);
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
      );

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
    setFile(undefined); //todo
    setOpen(false);
  };

  return (
    <div>
      <Modal
        sx={{ color: 'black' }}
        open={open}
        onClose={() => {
          if (user.avatar) {
            setOpen(false);
          }
        }}
      >
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          sx={{ maxWidth: 500 }}
        >
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            sx={{ color: 'black' }}
          >
            Modifying your avatar
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormLabel sx={{ color: 'black' }}>Max file size ...:</FormLabel>
              <input
                required
                type="file"
                name="file"
                id="raised-button-file"
                accept="image/*,.png,.jpg,.gif,.web"
                onChange={handleInput}
              />
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  ':hover': {
                    borderColor: 'black',
                    fontWeight: 'Bold'
                  }
                }}
              >
                Submit
              </Button>

              {/*<LoadingButton
                type="submit"
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                Save
              </LoadingButton>*/}
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditAvatar;
