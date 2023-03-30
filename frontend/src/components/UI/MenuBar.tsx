import { useState, useContext } from 'react';
import { NavigateOptions, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './UI.module.css';

const URL_LOGOUT = `${process.env.REACT_APP_URL_BACKEND}/auth/logout`;

const MenuBar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (
    navigateTo?: string,
    options?: NavigateOptions
  ) => {
    if (navigateTo !== undefined) {
      navigate(navigateTo, options);
    }
    setAnchorElUser(null);
  };

  const authenticate = () => {
    if (user.provider) {
      window.location.href = URL_LOGOUT;
    } else {
      handleCloseUserMenu('/login');
    }
  };

  return (
    <div>
      <nav className={styles.navibar}>
        <div className={styles.left}>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MoreVertIcon style={{ fill: 'whitesmoke' }} />
                <Avatar alt="" src={user.avatar} />
                <div className={styles.nickname}>{user.nickname}</div>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '42px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu()}
            >
              <MenuItem
                disabled={user.provider ? false : true}
                onClick={() => handleCloseUserMenu('/profile')}
              >
                Profile
              </MenuItem>
              <MenuItem
                disabled={user.provider ? false : true}
                onClick={() => handleCloseUserMenu(`/players/${user.nickname}`)}
              >
                History
              </MenuItem>
              <MenuItem onClick={() => authenticate()}>
                {user.provider ? 'Logout' : 'Login'}
              </MenuItem>
            </Menu>
          </Box>
        </div>
        <div className={styles.center}>
          <Button variant="text">
            <NavLink to=".">Home</NavLink>
          </Button>
          <Button variant="text">
            <NavLink to="chat">Chat</NavLink>
          </Button>
          <Button variant="text">
            <NavLink to="game">Game</NavLink>
          </Button>
        </div>
        <div className={styles.right}>
          <img
            src={require('../../assets/gameLogo.png')}
            alt=""
            className={styles.logo}
          />
        </div>
      </nav>
    </div>
  );
};

export default MenuBar;
