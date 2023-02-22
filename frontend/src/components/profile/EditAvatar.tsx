import { useState, useContext, SetStateAction, Dispatch } from 'react';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import errorAlert from '../UI/errorAlert';
import FormLabel from '@mui/joy/FormLabel';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

const URL_UPLOAD_AVATAR =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_UPLOAD_AVATAR);

const modalDialogStyle = {
  maxWidth: 500,
  border: '0px solid #000',
  bgcolor: '#f5f5f5a6',
  borderRadius: '4px'
};

const EditAvatar = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, setUser } = useContext(UserContext);
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
        const response = await axios.post(URL_UPLOAD_AVATAR, formData, {
          withCredentials: true,
          headers: { 'Content-type': 'multipart/form-data' }
        });
        //setUser(response.data); //todo
        //axios
        //  .get(String(process.env.REACT_APP_URL_AUTH), {
        //    withCredentials: true
        //  })
        //  .then(
        //    (response) => {
        //      setUser(response.data);
        //    },
        //    (error) => console.log(error)
        //  );
      } catch (error) {
        console.log(error);
        setOpen(false);
        errorAlert('Something went wrong');
      }
      setLoad(false);
      setButtonText('Done ✔️');
      console.log('new avatar uploaded');
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
              <FormLabel sx={{ color: 'black' }}>
                Max file size is 2 Mb
              </FormLabel>
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
