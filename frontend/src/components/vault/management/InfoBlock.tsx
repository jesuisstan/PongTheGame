import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { PlayerProfile } from '../../../types/PlayerProfile';
import { WebSocketContext } from '../../../contexts/WebsocketContext';
import { GameStatusContext } from '../../../contexts/GameStatusContext';
import { GameStatus } from '../../game/game.interface';
import { isUserBlocked } from '../utils/statusFunctions';
import InvitationSendModal from '../../game/invitation/InvitationSendModal';
import ButtonPong from '../../UI/ButtonPong';
import BadgePong from '../../UI/BadgePong';
import InfoNoteModal from './InfoNoteModal';
import NotePong from '../../UI/NotePong';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import * as color from '../../UI/colorsPong';
import styles from '../styles/PlayerCard.module.css';
import { User } from '../../../types/User';

const InfoBlock = ({ player }: { player: PlayerProfile }) => {
  const navigate = useNavigate();
  const socket = useContext(WebSocketContext);
  const { setGameStatus } = useContext(GameStatusContext);
  const { user, setUser } = useContext(UserContext);
  const [isFriendOfUser, setIsFriendOfUser] = useState<boolean>(false);
  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (user.nickname !== player.nickname) {
      if (isUserBlocked(user, player.id, null)) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    }
  }, [player, user]);

  const onBlockClick = (target: number) => {
    if (user.id !== target) {
      // Check if target is not already blocked
      try {
        for (let i = 0; i < user.blockedUsers.length; ++i)
          if (user.blockedUsers[i].id === target) return;
        socket.emit(
          'updateBlockedUsers',
          {
            userId: user.id,
            target: target,
            disconnect: false
          },
          (res: User) => {
            setUser(res);
          }
        );
        return;
      } catch (err) {
        errorAlert('Could not block this player. Try again');
      }
    }
  };

  const onUnBlockClick = (target: number) => {
    if (user.id !== target) {
      try {
        for (let i = 0; i < user.blockedUsers.length; ++i) {
          if (user.blockedUsers[i].id === target) {
            socket.emit(
              'updateBlockedUsers',
              {
                userId: user.id,
                target: target,
                disconnect: true
              },
              (res: User) => {
                setUser(res);
              }
            );
            return;
          }
        }
      } catch (err) {
        errorAlert('Could not unblock this player. Try again');
      }
    }
  };

  const handleBlock = () => {
    if (isBlocked) {
      onUnBlockClick(player.id);
      setIsBlocked(false);
    } else {
      onBlockClick(player.id);
      setIsBlocked(true);
    }
  };

  const handleFriend = () => {
    if (isFriendOfUser) {
      backendAPI.post(`/friend/remove/${player.id}`).then(
        (response) => {
          setIsFriendOfUser(false);
        },
        (error) => {
          errorAlert(`Failed to unfollow ${player.nickname}`);
        }
      );
    } else {
      backendAPI.post(`/friend/add/${player.id}`).then(
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
    setGameStatus(GameStatus.SPECTATE);
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
          sx={{ width: 150, height: 150 }}
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
            text={isBlocked ? 'Unblock' : 'Block'}
            title={isBlocked ? 'Unblock this player' : 'Block this player'}
            onClick={() => handleBlock()}
            startIcon={
              isBlocked ? <RecordVoiceOverIcon /> : <VoiceOverOffIcon />
            }
          />
          <ButtonPong
            text={'Invite'}
            title={'Invite to play a game'}
            onClick={() => setOpenInvitationModal(true)}
            startIcon={<SportsEsportsIcon />}
            disabled={player.status === 'ONLINE' && !isBlocked ? false : true}
          />
          <ButtonPong
            text={'Watch'}
            title={`Spectate the current game of ${player.nickname}`}
            onClick={() => sendSpectate(player.id)}
            startIcon={<VisibilityIcon />}
            disabled={player.status === 'PLAYING' ? false : true}
          />
          <div>
            <InfoNoteModal open={open} setOpen={setOpen} player={player} />
            <NotePong setOpen={setOpen} />
          </div>
        </div>
      )}
      <ButtonPong
        text="Back"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosIcon />}
      />
    </div>
  );
};

export default InfoBlock;
