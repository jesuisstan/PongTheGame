import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { User } from '../../../types/User';
import BadgePong from '../../UI/BadgePong';
import BlackNoteModal from './BlackNoteModal';
import NotePong from '../../UI/NotePong';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LoopIcon from '@mui/icons-material/Loop';
import * as color from '../../UI/colorsPong';
import styles from '../styles/PlayerCard.module.css';

const BlackListBlock = ({
  socketEvent
}: {
  socketEvent: number;
}) => {
  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const fetchBlackList = () => {
    backendAPI.get('/auth/getuser').then(
      (response: { data: User }) => {
        setUser(response.data);
      },
      () => {
        errorAlert('Failed to get Black List');
      }
    );
  };

  useEffect(() => {
    fetchBlackList();
  }, [socketEvent]);

  return (
    <div className={styles.friendsBlock}>
      <Typography
        textColor={color.PONG_ORANGE}
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
      >
        Black list
      </Typography>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '21px'
          }}
        >
          {user.blockedUsers.length ? (
            user.blockedUsers.map((item) => (
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
        <BlackNoteModal open={open} setOpen={setOpen} />
        <NotePong setOpen={setOpen} />
        <IconButton
          color="primary"
          title={'Refresh the list'}
          onClick={() => fetchBlackList()}
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

export default BlackListBlock;
