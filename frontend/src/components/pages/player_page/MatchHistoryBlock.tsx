import { useEffect, useState } from 'react';
import { Player } from '../../../types/Player';
import { MatchHistory } from '../../../types/MatchHistory';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';

const MatchHistoryBlock = ({ player }: { player: Player }) => {
  const [matchHistory, setMatchHistory] = useState<MatchHistory>({
    played: '-',
    wins: '-',
    loses: '-'
  });

  useEffect(() => {
    backendAPI.get(`/stats/${player.nickname}`).then(
      (response) => {
        setMatchHistory((prevState) => ({
          ...prevState,
          played: response.data.match_play,
          wins: response.data.match_win,
          loses: response.data.match_lose
        }));
      },
      (error) => {
        errorAlert(`Failed to get player's match history`);
      }
    );
  }, []);

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
      <Typography component="legend">
        Games played: {matchHistory.played}
      </Typography>
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
        Wins: {matchHistory.wins}
      </Typography>
      <Typography textAlign="left" component="legend">
        Loses: {matchHistory.loses}
      </Typography>
    </div>
  );
};

export default MatchHistoryBlock;
