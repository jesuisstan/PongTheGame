import Button from '@mui/material/Button';

const ButtonPong = ({ text, endIcon, onClick }: any) => {
  return (
    <Button
      sx={{
        backgroundColor: 'black',
        ':hover': { backgroundColor: 'rgba(253, 80, 135, 0.6)' }
      }}
      size="medium"
      variant="contained"
      endIcon={endIcon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ButtonPong;
