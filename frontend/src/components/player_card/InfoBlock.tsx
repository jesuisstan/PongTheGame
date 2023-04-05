import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { PlayerProfile } from '../../types/PlayerProfile';
import { WebSocketContext } from '../../contexts/WebsocketContext';
import { GameStatusContext } from '../../contexts/GameStatusContext';
import { GameStatus } from '../game/game.interface';
import InvitationSendModal from '../game/invitation/InvitationSendModal';
import ButtonPong from '../UI/ButtonPong';
import BadgePong from '../UI/BadgePong';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import VisibilityIcon from '@mui/icons-material/Visibility';
import * as color from '../UI/colorsPong';
import styles from './styles/PlayerCard.module.css';

const InfoBlock = ({ player }: { player: PlayerProfile }) => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const { setGameStatus } = useContext(GameStatusContext);
  const { user } = useContext(UserContext);
  const [isFriendOfUser, setIsFriendOfUser] = useState(false);
  const [openInvitationModal, setOpenInvitationModal] = useState(false);

  useEffect(() => {
    if (user.nickname !== player.nickname) {
      backendAPI.get(`/friend`).then(
        (response) => {
          let userFriendsList: PlayerProfile[] = response.data.friends;
          let isFriend = userFriendsList.find(
            (friend) => friend.nickname === player.nickname
          );
          if (isFriend) {
            setIsFriendOfUser(true);
          } else {
            setIsFriendOfUser(false);
          }
        },
        (error) => {
          errorAlert(`Failed to load your friends list`);
        }
      );
    }
  }, [player.nickname, user.nickname]);

  const handleFriend = () => {
    if (isFriendOfUser) {
      backendAPI.patch(`/friend/remove${player.nickname}`).then(
        (response) => {
          setIsFriendOfUser(false);
        },
        (error) => {
          errorAlert(`Failed to unfollow ${player.nickname}`);
        }
      );
    } else {
      backendAPI.post(`/friend/add/${player.nickname}`).then(
        (response) => {
          setIsFriendOfUser(true);
        },
        (error) => {
          errorAlert(`Failed to follow ${player.nickname}`);
        }
      );
    }
  };

  const sendSpectate = (id: number) => {
    socket.emit('match_spectate', { id: id });
    setGameStatus(GameStatus.PLAYING);
    navigate('/game');
  };

  return (
    <div className={styles.basicInfoBlock}>
      <InvitationSendModal
        open={openInvitationModal}
        setOpen={setOpenInvitationModal}
        invitee={player.nickname}
      />
      <BadgePong player={player}>
        <Avatar
          src={player.avatar}
          alt=""
          variant="circular"
          sx={{ width: 200, height: 200 }}
        />
      </BadgePong>
      <div>
        <Typography
          textColor={color.PONG_ORANGE}
          level="body3"
          textTransform="uppercase"
          fontWeight="lg"
        >
          Player:
        </Typography>
        <Typography>{player.username}</Typography>
      </div>
      <div>
        <Typography
          textColor={color.PONG_ORANGE}
          level="body3"
          textTransform="uppercase"
          fontWeight="lg"
        >
          Nickname:
        </Typography>
        <Typography>{player.nickname}</Typography>
      </div>
      {user.nickname !== player.nickname && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ButtonPong
            text={isFriendOfUser ? 'Forget' : 'Follow'}
            title={
              isFriendOfUser ? 'Unfollow this player' : 'Follow this player'
            }
            onClick={() => handleFriend()}
            startIcon={isFriendOfUser ? <PersonOffIcon /> : <PersonAddIcon />}
          />
          <ButtonPong
            text={'Invite'}
            title={'Invite to play a game'}
            onClick={() => setOpenInvitationModal(true)}
            startIcon={<SportsEsportsIcon />}
            disabled={player.status === 'ONLINE' ? false : true}
          />
          <ButtonPong
            text={'Watch'}
            title={`Spectate the current game of ${player.nickname}`}
            onClick={() => sendSpectate(player.id)}
            startIcon={<VisibilityIcon />}
            disabled={player.status === 'PLAYING' ? false : true}
          />
        </div>
      )}
      <div style={{ marginTop: '21px' }}>
        <ButtonPong
          text="Back"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosIcon />}
        />
      </div>
    </div>
  );
};

export default InfoBlock;
