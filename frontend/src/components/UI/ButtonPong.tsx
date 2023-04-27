import Button from '@mui/material/Button';
import * as color from '../UI/colorsPong';

const ButtonPong = ({
  text,
  onClick,
  title,
  endIcon,
  startIcon,
  disabled,
  inversedColors
}: {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  inversedColors?: boolean;
}) => {
  return (
    <Button
      sx={{
        minWidth: '132px',
        color: !inversedColors ? color.PONG_WHITE : 'black',
        backgroundColor: !inversedColors ? 'black' : color.PONG_PINK,
        fontWeight: 'Bold',
        border: '0.5px solid transparent',
        ':hover': {
          transitionDuration: '0.5s',
          backgroundColor: !inversedColors ? color.PONG_PINK : 'black',
          color: !inversedColors ? 'black' : color.PONG_WHITE,
          border: inversedColors
            ? `0.5px solid ${color.PONG_PINK}`
            : '0.5px solid transparent'
        }
      }}
      title={title}
      size="medium"
      variant="contained"
      onClick={onClick}
      endIcon={endIcon}
      startIcon={startIcon}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default ButtonPong;
