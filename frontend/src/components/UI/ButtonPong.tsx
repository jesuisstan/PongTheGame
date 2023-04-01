import Button from '@mui/material/Button';

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
        minWidth: '121px',
        color: !inversedColors ? 'whitesmoke' : 'black',
        backgroundColor: !inversedColors ? 'black' : 'rgb(253, 80, 135)',
        fontWeight: !inversedColors ? '' : 'Bold',
        ':hover': {
          backgroundColor: !inversedColors ? 'rgb(253, 80, 135)' : 'black',
          color: !inversedColors ? 'black' : 'whitesmoke',
          fontWeight: 'Bold'
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
