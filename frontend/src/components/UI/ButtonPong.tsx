import Button from '@mui/material/Button';

const ButtonPong = ({ text, onClick, endIcon, startIcon }: any) => {
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
