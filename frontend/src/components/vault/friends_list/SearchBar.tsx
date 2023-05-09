import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backendAPI from '../../../api/axios-instance';
import errorAlert from '../../UI/errorAlert';
import { AxiosError } from 'axios';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/joy/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../styles/PlayerCard.module.css';
import * as color from '../../UI/colorsPong';

const SearchBar = () => {
  const navigate = useNavigate();
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

  const searchPlayer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchValue !== '') {
      try {
        await backendAPI.get(`/user/${searchValue}`);
        navigate(`/vault/${searchValue}`);
      } catch (error) {
        const err = error as AxiosError<any>;
        if (err.response?.status === 404) {
          errorAlert('Player with such a nickname was not found');
        } else {
          errorAlert('Something went wrong');
        }
      }
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
  );
};

export default SearchBar;
