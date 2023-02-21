import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import styles from './UI.module.css';

const URL_LOGOUT =
  String(process.env.REACT_APP_URL_BACKEND) +
  String(process.env.REACT_APP_URL_LOGOUT);

const MenuBar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const authenticate = () => {
    if (user.provider) {
      localStorage.removeItem('totpVerified');
      window.location.href = URL_LOGOUT;
    } else {
      window.location.href = 'http://localhost:3000/login';
    }
  };

  return (
    <div>
      <nav className={styles.navibar}>
        <div className={styles.left}>
          <img
            src={require('../../assets/gameLogo.png')}
            alt=""
            className={styles.logo}
          />
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
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <div className={styles.nickname}>{user.nickname}</div>
                <Avatar alt="" src={user.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '42px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                disabled={user.provider ? false : true}
                onClick={handleCloseUserMenu}
              >
                <div onClick={(event) => navigate('/profile')}>Profile</div>
              </MenuItem>
              <MenuItem
                disabled={user.provider ? false : true}
                onClick={handleCloseUserMenu}
              >
                <div onClick={(event) => navigate('/history')}>History</div>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <div onClick={authenticate}>
                  {user.provider ? 'Logout' : 'Login'}
                </div>
              </MenuItem>
            </Menu>
          </Box>
        </div>
      </nav>
    </div>
  );
};

export default MenuBar;
