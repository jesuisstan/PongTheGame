import Button from '@mui/material/Button';

const ButtonPong = ({
  text,
  title,
  onClick,
  endIcon,
  startIcon,
  disabled
}: {
  text: string;
  title?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <Button
      sx={{
        minWidth: '121px',
        backgroundColor: 'black',
        ':hover': {
          backgroundColor: 'rgb(253, 80, 135)',
          color: 'black',
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
