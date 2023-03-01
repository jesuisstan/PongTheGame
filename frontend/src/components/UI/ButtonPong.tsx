import { MarginOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';

const ButtonPong = ({
  text,
  onClick,
  endIcon,
  startIcon
}: {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
}) => {
  return (
    <Button
      sx={{
        backgroundColor: 'black',
        ':hover': {
          backgroundColor: 'rgba(253, 80, 135, 0.6)',
          color: 'black',
          fontWeight: 'Bold'
        }
      }}
      size="medium"
      variant="contained"
      onClick={onClick}
      endIcon={endIcon}
      startIcon={startIcon}
    >
      {text}
    </Button>
  );
};

export default ButtonPong;
