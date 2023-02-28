import ButtonPong from './ButtonPong';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

interface IMateProps {
  style: string;
  firstName: string;
  lastName: string;
  login: string;
  role: string;
  description: string;
  github: string;
  email: string;
}

const Mate = (props: IMateProps) => {
  return (
    <>
      <article className={props.style}>
        <Stack spacing={2}>
          <Typography
            id="basic-list-demo"
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            {props.firstName + ' ' + props.lastName}
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            {props.description}
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            {props.role}
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            {props.email}
          </Typography>
          <div>
            <ButtonPong
              text="To github"
              onClick={() => window.open(props.github)}
              endIcon={<ArrowForwardIosIcon />}
            />
          </div>
        </Stack>
      </article>
    </>
  );
};
export default Mate;
