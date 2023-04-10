import { useEffect, useState } from 'react';
import { PlayerProfile } from '../../../types/PlayerProfile';
import { MatchHistory } from '../../../types/MatchHistory';
import HistoryNoteModal from './HistoryNoteModal';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import * as color from '../../UI/colorsPong';
import styles from '../styles/PlayerCard.module.css';
import NotePong from '../../UI/NotePong';

const MatchHistoryBlock = ({
  player,
  socketEvent
}: {
  player: PlayerProfile;
  socketEvent: number;
}) => {
  const [matchHistory, setMatchHistory] = useState<MatchHistory>({
    played: '-',
    wins: '-',
    loses: '-'
  });
  const [open, setOpen] = useState(false);

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
  }, [socketEvent, player.nickname]);

  return (
    <div className={styles.historyBlock}>
      <Typography
        textColor={color.PONG_ORANGE}
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
          textColor={color.PONG_ORANGE}
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
      <div>
        <NotePong setOpen={setOpen} />
        <HistoryNoteModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default MatchHistoryBlock;
