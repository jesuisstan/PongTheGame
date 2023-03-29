import { useNavigate } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import { Player } from '../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import styles from './PlayerCard.module.css';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

const InfoBlock = ({ player }: { player: Player }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isFriendOfUser, setIsFriendOfUser] = useState(false);
  const [buttonText, setButtonText] = useState(
    isFriendOfUser ? 'Uuuunfollow' : 'Fffolow'
  );
  console.log(isFriendOfUser);

  const [friendsList, setFriendsList] = useState<Player[]>([]);

  useEffect(() => {
    if (user.nickname !== player.nickname) {
      backendAPI.get(`/friend/friends`).then(
        (response) => {
          let userFriendList: Player[] = response.data.friends;
          let isFriend = userFriendList.find(
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
  }, [buttonText, isFriendOfUser]);

  const handleFriend = () => {
    if (isFriendOfUser) {
      backendAPI.patch(`/friend/remove${player.nickname}`).then(
        (response) => {
          console.log(response);
          setIsFriendOfUser(false);

          setButtonText('Follow');
          console.log('removed friend');
        },
        (error) => {
          errorAlert(`Failed to unfollow ${player.nickname}`);
        }
      );
    } else {
      backendAPI.post(`/friend/add/${player.nickname}`).then(
        (response) => {
          setIsFriendOfUser(true);

          setButtonText('Unfollow');
          console.log('added friend');
        },
        (error) => {
          errorAlert(`Failed to follow ${player.nickname}`);
        }
      );
    }
  };

  return (
    <div className={styles.basicInfoBlock}>
      <Avatar
        src={player.avatar}
        alt=""
        variant="rounded"
        sx={{ width: 200, height: 200 }}
      />
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
        <ButtonPong
          text={buttonText}
          title={
            isFriendOfUser
              ? 'Delete from your friends list'
              : 'Add to your friends list'
          }
          onClick={() => handleFriend()}
          startIcon={isFriendOfUser ? <PersonOffIcon /> : <PersonAddIcon />}
        />
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
