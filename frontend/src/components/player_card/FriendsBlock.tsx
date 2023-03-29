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

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}));

const FriendsBlock = ({ player }: { player: Player }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [friendsList, setFriendsList] = useState<Player[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  const [error, setError] = useState('');

  console.log('search for');
  console.log(searchValue);

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

  const searchPlayer = () => {
    console.log('submit clicked');

    //backendAPI.get(`/friend/search/${searchValue}`).then(
    //  (response) => {
    //    setFriendsList(response.data.friends);
    //  },
    //  (error) => {
    //    errorAlert(`Failed to search for ${searchValue}`);
    //  }
    //);
  };

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
        {user.nickname === player.nickname && (
          <form>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '200px',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <TextField
                id="search-bar"
                className="text"
                onInput={handleSearchChange}
                label="Enter nickname"
                variant="outlined"
                placeholder="Search..."
                size="small"
                inputProps={{
                  'aria-label': 'search',
                  minLength: 3,
                  maxLength: 10
                }}
              />
              <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: 'whitesmoke' }} />
              </IconButton>
            </div>
          </form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '21px' }}>
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
            <Typography sx={{ marginTop: '21px' }}>List is empty</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsBlock;
