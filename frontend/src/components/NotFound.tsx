import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ButtonPong from './UI/ButtonPong';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Not found</h1>
      <ButtonPong
        text="Back"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosIcon />}
      />
      <ButtonPong
        text="Home"
        onClick={() => navigate('/')}
        endIcon={<ArrowForwardIosIcon />}
      />
    </div>
  );
};

export default NotFound;
