import ButtonPong from './ButtonPong';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

interface IMateProps {
  style: string;
  firstName: string;
  lastName: string;
  description: string;
  intraNickname: string;
  role: string;
  github: string;
}

const Peer = (props: IMateProps) => {
  return (
    <>
      <article className={props.style}>
        <Stack spacing={1}>
          <Typography
            id="basic-list-demo"
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            {props.lastName + ' ' + props.firstName}
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            {props.description}
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            Location: Paris, France
          </Typography>
          <Typography id="basic-list-demo" level="body3">
            {props.role}
          </Typography>
          <div>
            <ButtonPong
              text="To github"
              onClick={() => window.open(props.github)}
            />{' '}
            <ButtonPong
              text="To École 42"
              onClick={() =>
                window.open(
                  'https://profile.intra.42.fr/users/' + props.intraNickname
                )
              }
            />
          </div>
        </Stack>
      </article>
    </>
  );
};
export default Peer;
