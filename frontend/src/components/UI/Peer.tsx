import ButtonPong from './ButtonPong';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface IMateProps {
  style: string;
  firstName: string;
  lastName: string;
  description: string;
  intraNickname: string;
  duty: string;
  duty2?: string;
  duty3?: string;
  github: string;
}

const Peer = (props: IMateProps) => {
  return (
    <>
      <article className={props.style}>
        <Stack spacing={1}>
          <Typography
            id="basic-list-demo"
            variant="h3"
            fontSize={21}
            textTransform="uppercase"
            fontWeight="bold"
          >
            {props.lastName + ' ' + props.firstName}
          </Typography>
          <Typography id="basic-list-demo"><strong>{props.description}</strong></Typography>
          <Typography id="basic-list-demo">{props.duty}</Typography>
          <Typography id="basic-list-demo">{props.duty2}</Typography>
          <Typography id="basic-list-demo">{props.duty3}</Typography>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', paddingTop: '10px' }}>
            <ButtonPong
              text="To github"
              onClick={() => window.open(props.github)}
            />
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
