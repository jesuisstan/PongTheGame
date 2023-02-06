import { useState } from 'react';
import Button from '@mui/material/Button';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import Swal from 'sweetalert2';

const urlUploadAvatar = 'http://localhost:3080/avatar/upload';

const EditAvatar = ({ user, setAvatar, open, setOpen }: any) => {
  const [file, setFile] = useState<File>();

  const handleInput = (event: React.FormEvent) => {
    //const newFile = event.target.files[0];
    //setFile(newFile);
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  console.log('setted file is: ');
  console.log(file);

  //  const handleSubmit = (event: any) => {
  //    event.preventDefault();
  //    if (file) setAvatar(file);
  //    setFile(undefined);
  //    setOpen(false);
  //  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('avatar', file!);

    axios({
      url: 'http://localhost:3080/avatar/upload',
      method: 'POST',
      headers: { 'Content-type': 'multipart/form-data' },
      data: formData
    }).then(
      (response) => {
        console.log(response.data);
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
    //setFile(undefined);
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
                accept="image/*,.png,.jpg,.gif,.web"
                onChange={handleInput}
                id="raised-button-file"
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
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default EditAvatar;
