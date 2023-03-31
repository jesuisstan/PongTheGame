import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/joy/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles/PlayerCard.module.css';
import { Params, useParams } from 'react-router-dom';

const SearchBar = () => {
  const { user } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue.match(/^[A-Za-z0-9_-]*$/)) {
      setSearchValue(newValue);
      setError('');
    } else {
      setError('Allowed: A-Z _ a-z - 0-9');
    }
  };

  const searchPlayer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchValue !== '') {
      window.location.href = `/players/${searchValue}`;
    }
  };

  return (
    <div style={{ paddingBottom: '21px' }}>
      <form className={styles.searchForm} onSubmit={searchPlayer}>
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
                  color: 'whitesmoke'
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
                  color: 'rgba(253, 80, 135, 0.91)'
                }
              }}
            />
          </IconButton>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
