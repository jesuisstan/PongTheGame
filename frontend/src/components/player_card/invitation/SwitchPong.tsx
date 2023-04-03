import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/joy/Typography';
import { alpha, styled } from '@mui/material/styles';
import * as color from '../../UI/colorsPong';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    '&:hover': {
      backgroundColor: alpha(color.PONG_PINK, theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: color.PONG_PINK
  },
  '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
    backgroundColor: theme.palette.grey[400]
  },
  '& .MuiSwitch-switchBase.Mui-disabled': {
    color: theme.palette.grey[400],
    '& + .MuiSwitch-track': {
      opacity: 0.5
    }
  }
}));

const SwitchPong = ({
  checked,
  disabled,
  onClick
}: {
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>Off</Typography>
      <PinkSwitch
        checked={checked}
        disabled={disabled}
        onClick={onClick}
        color="default"
      />
      <Typography>On</Typography>
    </Stack>
  );
};

export default SwitchPong;
