import { useNavigate } from 'react-router-dom';
import ButtonPong from '../../UI/ButtonPong';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { Player } from '../../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import styles from './PlayerCard.module.css';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import { Achievement } from '../../../types/Achievement';

const FriendsBlock = ({ player }: { player: Player }) => {
  const { user } = useContext(UserContext);
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    backendAPI.get(`/friend/friends`).then(
      (response) => {
        //setFriendsList(response.data);
        console.log(response.data.friends);
      },
      (error) => {
        console.log(error);

        errorAlert(`Failed to get ${player.nickname}'s friends list`);
      }
    );
  }, []);

  const handleFriend = () => {
    return backendAPI.post('/friend/add').then(
      (response) => {
        console.log('added a friend');
        console.log(response.data);
      },
      (error) => {
        errorAlert('Failed to add friend');
        console.log(error);
      }
    );
  };

  const searchFriend = () => {};

  return (
    <div className={styles.achieveBlock}>
      <Typography
        textColor="rgb(37, 120, 204)"
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
      >
        Friends list
      </Typography>
      {/*{friendsList.map((item) => (
        <Typography
          key={item.id}
          title={item.Description}
          sx={{
            '&:hover': {
              transform: 'scale(1.1)',
              cursor: 'wait'
            }
          }}
        >
          {item.Name}
        </Typography>
      ))}*/}
      <div style={{ marginTop: '21px' }}>
        {user.nickname !== player.nickname ? (
          <ButtonPong
            text="Add as friend"
            title="Add this players to friends list"
            onClick={handleFriend}
            startIcon={<PersonAddIcon />}
          />
        ) : (
          <ButtonPong
            text="Find a friend"
            title="Search for a friend by nickname"
            onClick={(nickname) => searchFriend()}
            startIcon={<PersonSearchIcon />}
          />
        )}
      </div>
    </div>
  );
};

export default FriendsBlock;
