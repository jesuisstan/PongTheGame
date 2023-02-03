import Button from '@mui/material/Button';

const ButtonPong = ({ text, endIcon, onClick }: any) => {
  return (
    <Button
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        ':hover': { backgroundColor: 'black' }
      }}
      variant="contained"
      endIcon={endIcon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default ButtonPong;
