import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import * as color from '../../UI/colorsPong';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: color.PONG_PINK,
    '&:hover': {
      backgroundColor: alpha(color.PONG_PINK, theme.palette.action.hoverOpacity)
    }
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: color.PONG_PINK
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
  return <PinkSwitch checked={checked} disabled={disabled} onClick={onClick} />;
};

export default SwitchPong;
