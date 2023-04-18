import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { PlayerProfile } from '../../../types/PlayerProfile';
import SearchBar from './SearchBar';
import BadgePong from '../../UI/BadgePong';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import FriendsNoteModal from './FriendsNoteModal';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LoopIcon from '@mui/icons-material/Loop';
import * as color from '../../UI/colorsPong';
import styles from '../styles/PlayerCard.module.css';
import NotePong from '../../UI/NotePong';

const FriendsBlock = ({
  player,
  socketEvent
}: {
  player: PlayerProfile;
  socketEvent: number;
}) => {
  const { user } = useContext(UserContext);
  const [friendsList, setFriendsList] = useState<PlayerProfile[]>([]);
  const [open, setOpen] = useState(false);

  const fetchFriendsList = () => {
    backendAPI.get(`/friend/${player.nickname}`).then(
      (response) => {
        setFriendsList(response.data.friends);
      },
      (error) => {
        errorAlert(`Failed to get ${player.nickname}'s friends list`);
      }
    );
  };

  useEffect(() => {
    fetchFriendsList();
  }, [socketEvent]);

  return (
    <div className={styles.friendsBlock}>
      <Typography
        textColor={color.PONG_ORANGE}
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
                rel="noreferrer"
              >
                <div className={styles.friendLine}>
                  <BadgePong player={item}>
                    <Avatar
                      alt=""
                      src={item.avatar}
                      variant="circular"
                      sx={{
                        width: 35,
                        height: 35,
                        ':hover': {
                          cursor: 'pointer'
                        }
                      }}
                      title={item.username}
                    />
                  </BadgePong>
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
      <div>
        <FriendsNoteModal open={open} setOpen={setOpen} player={player} />
        <NotePong setOpen={setOpen} />
        <IconButton
          color="primary"
          title={'Refresh the list'}
          onClick={() => fetchFriendsList()}
        >
          <LoopIcon
            fontSize="large"
            sx={{
              color: 'black',
              '&:hover': {
                color: color.PONG_ORANGE
              }
            }}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default FriendsBlock;
