import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Player } from '../../types/Player';
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
import styles from './styles/PlayerCard.module.css';
import { WebSocketContext } from '../../contexts/WebsocketContext';

const InfoBlock = ({ player }: { player: Player }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const socket = useContext(WebSocketContext);
  const [isFriendOfUser, setIsFriendOfUser] = useState(false);

  function inviteFriendsCustom(nickname : string){
    console.log("Create a modal for the user can select the winning score && if he want the obstacle");

    // Send a socket to the back with info :
    // winscore
    // obstacle : true of false
    // Name of the people he invite

    // When the user press to button of the modal after selected the config of the game

    socket.emit('match_get_invitation', {winscore : 5 , obstacle : false, nickname : nickname}) // The second argument is TMP
    // The other user is gonne get the notification on the request 'invitation_game' // He have to accept or decline the game
  }

  socket.on("match_invitation_error", (args) => {
      // If a error occurs
  })

  useEffect(() => {
    if (user.nickname !== player.nickname) {
      backendAPI.get(`/friend`).then(
        (response) => {
          let userFriendsList: Player[] = response.data.friends;
          let isFriend = userFriendsList.find(
            (friend) => friend.nickname === player.nickname
          );
          if (isFriend) {
            setIsFriendOfUser(true);
            console.log(`${player.nickname} is in the friends list.`);
          } else {
            setIsFriendOfUser(false);
            console.log(`${player.nickname} is not in the friends list.`);
          }
        },
        (error) => {
          errorAlert(`Failed to load your friends list`);
        }
      );
    }
  }, []);

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

  return (
    <div className={styles.basicInfoBlock}>
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
          textColor="rgb(37, 120, 204)"
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
          textColor="rgb(37, 120, 204)"
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
            onClick={() => inviteFriendsCustom(player.nickname)}
            startIcon={<SportsEsportsIcon />}
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
