import { useEffect, useState } from 'react';
import { Player } from '../../types/Player';
import { MatchHistory } from '../../types/MatchHistory';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Typography from '@mui/joy/Typography';

const MatchHistoryBlock = ({
  player,
  socketEvent
}: {
  player: Player;
  socketEvent: number;
}) => {
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
  }, [socketEvent]);

  return (
    <div
      style={{
        minWidth: '210px',
        display: 'flex',
        flexDirection: 'column',
        gap: '21px'
      }}
    >
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
      <div>
        <Typography
          level="h1"
          textColor="rgb(37, 120, 204)"
          fontWeight="lg"
          textAlign="left"
        >
          Including:
        </Typography>
        <Typography component="legend" textAlign="left">
          Wins: {matchHistory.wins}
        </Typography>
        <Typography component="legend" textAlign="left">
          Loses: {matchHistory.loses}
        </Typography>
      </div>
    </div>
  );
};

export default MatchHistoryBlock;
