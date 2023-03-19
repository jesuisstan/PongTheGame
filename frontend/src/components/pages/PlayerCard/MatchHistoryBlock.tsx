import { Player } from '../../../types/Player';
import Typography from '@mui/joy/Typography';

const MatchHistoryBlock = ({ player }: { player: Player }) => {
  return (
    <div style={{ minWidth: '210px' }}>
      <Typography
        textColor="rgb(37, 120, 204)"
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
      >
        Match history
      </Typography>
      <Typography component="legend">Games played: {0}</Typography>
      <Typography
        mt={2}
        level="h1"
        textColor="rgb(37, 120, 204)"
        fontWeight="lg"
        textAlign="left"
      >
        Including:
      </Typography>
      <Typography textAlign="left" component="legend">
        Wins: {0}
      </Typography>
      <Typography textAlign="left" component="legend">
        Draws: {0}
      </Typography>
      <Typography textAlign="left" component="legend">
        Loses: {0}
      </Typography>
    </div>
  );
};

export default MatchHistoryBlock;
