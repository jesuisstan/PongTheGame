import { Dispatch, SetStateAction } from 'react';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import * as color from './colorsPong';

const NotePong = ({
  setOpen
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <IconButton color="primary" title={'Note'} onClick={() => setOpen(true)}>
      <HelpOutlineIcon
        fontSize="large"
        sx={{
          color: 'black',
          '&:hover': {
            color: color.PONG_ORANGE
          }
        }}
      />
    </IconButton>
  );
};

export default NotePong;
