import { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { isUserBlocked } from '../../chat/utils/statusFunctions';
import InvitationSendModal from '../invitation/InvitationSendModal';
import errorAlert from '../../UI/errorAlert';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/joy/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Lobby.module.css';
import * as color from '../../UI/colorsPong';

const LobbySearchBar = () => {
  const { user } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === user.nickname) {
      setSearchValue('');
      errorAlert(`It's you. Come on! Try again, please`);
    } else if (isUserBlocked(user, null, newValue)) {
      setSearchValue('');
      errorAlert(`Unblock ${newValue} before inviting to your game`);
    } else if (newValue.match(/^[A-Za-z0-9_-]*$/)) {
      setSearchValue(newValue);
      setError('');
    } else {
      setError('Allowed: A-Z _ a-z - 0-9');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchValue && !error) {
      setOpen(true);
    }
  };

  return (
    <div>
      <InvitationSendModal
        open={open}
        setOpen={setOpen}
        invitee={searchValue}
      ></InvitationSendModal>

      <div style={{ paddingBottom: '21px' }}>
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <div style={{ display: 'flex' }}>
            <FormControl>
              <TextField
                id="search-bar"
                required
                label="Find by nickname"
                variant="standard"
                placeholder="Search..."
                size="small"
                value={searchValue}
                inputProps={{
                  'aria-label': 'search',
                  minLength: 3,
                  maxLength: 10,
                  style: {
                    color: color.PONG_WHITE
                  }
                }}
                error={!!error}
                helperText={error}
                onChange={handleTextInput}
              />
            </FormControl>
            <IconButton type="submit" aria-label="search">
              <SearchIcon
                fontSize="medium"
                sx={{
                  color: 'black',
                  '&:hover': {
                    color: color.PONG_PINK
                  }
                }}
              />
            </IconButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LobbySearchBar;
