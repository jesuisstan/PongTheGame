import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import styles from './MenuBar.module.css';

const MenuBar = ({ user }: any) => {
  const navigate = useNavigate();
  const authenticate = () => {
    if (user.provider) {
      window.location.href = 'http://localhost:3080/auth/logout';
    } else {
      window.location.href = 'http://localhost:3000/login';
    }
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
          <div className={styles.nickname}>{user.nickname}</div>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
                <div onClick={(event) => navigate('/match_history')}>
                  History
                </div>
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
