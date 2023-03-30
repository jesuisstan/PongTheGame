import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Player } from '../../types/Player';
import SearchBar from './SearchBar';
import backendAPI from '../../api/axios-instance';
import errorAlert from '../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import styles from './styles/PlayerCard.module.css';

const FriendsBlock = ({ player }: { player: Player }) => {
  const { user } = useContext(UserContext);
  const [friendsList, setFriendsList] = useState<Player[]>([]);

  // get the friends list of the Player (not current User!)
  useEffect(() => {
    //backendAPI.get(`/friend/${player.nickname}`).then( // todo should be? doesn't work
    backendAPI.get(`/friend/friends`).then(
      (response) => {
        setFriendsList(response.data.friends);
      },
      (error) => {
        errorAlert(`Failed to get ${player.nickname}'s friends list`);
      }
    );
  }, [player.nickname]);

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
      <div>
        {user.nickname === player.nickname && <SearchBar />}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '21px'
          }}
        >
          {friendsList.length ? (
            friendsList.map((item) => (
              <a
                key={item.id}
                href={`/players/${item.nickname}`}
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
        </div>
      </div>
    </div>
  );
};

export default FriendsBlock;
