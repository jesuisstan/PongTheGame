import Divider from '@mui/material/Divider';
import * as color from './colorsPong';

const DeviderPong = ({ horizontal }: { horizontal?: boolean }) => (
  <Divider
    orientation={horizontal ? 'horizontal' : 'vertical'}
    flexItem
    sx={{
      backgroundColor: color.PONG_WHITE_TRANS,
      borderWidth: '1px'
    }}
  />
);

export default DeviderPong;
