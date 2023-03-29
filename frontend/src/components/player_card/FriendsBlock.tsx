import { useNavigate, useParams } from 'react-router-dom';
import ButtonPong from '../UI/ButtonPong';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Player } from '../../types/Player';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import styles from './PlayerCard.module.css';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import * as MUI from '../UI/MUIstyles';

const FriendsBlock = ({ player }: { player: Player }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [friendsList, setFriendsList] = useState<Player[]>([]);

  // get the friends list of the Player (not current User!)
  useEffect(() => {
    backendAPI.get(`/friend/friends`).then(
      (response) => {
        setFriendsList(response.data.friends);
        //console.log(response.data.friends);
      },
      (error) => {
        console.log(error);

        errorAlert(`Failed to get ${player.nickname}'s friends list`);
      }
    );
  }, []);

  const searchFriend = () => {};

  return (
    <div className={styles.friendsBlock}>
      <Typography
        textColor="rgb(37, 120, 204)"
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
      >
        Friends list
      </Typography>
      {friendsList.length ? (
        friendsList.map((item) => (
          <a
            key={item.id}
            href={`http://localhost:3000/players/${item.nickname}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className={styles.friendLine}>
              <Avatar
                alt=""
                src={item.avatar}
                variant="rounded"
                sx={{
                  width: 35,
                  height: 35,
                  ':hover': {
                    cursor: 'pointer'
                  }
                }}
                title={item.username}
              />
              <Typography key={item.id} title={item.username}>
                {item.nickname}
              </Typography>
            </div>
          </a>
        ))
      ) : (
        <Typography>List is empty</Typography>
      )}
      <div style={{ marginTop: '21px' }}>
        {user.nickname === player.nickname && (
          <ButtonPong
            text="Find new"
            title="Find & follow by nickname"
            onClick={searchFriend}
            startIcon={<PersonSearchIcon />}
          />
        )}
      </div>
    </div>
  );
};

export default FriendsBlock;
