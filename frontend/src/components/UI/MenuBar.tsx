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
import useMediaQuery from '@mui/material/useMediaQuery';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import * as color from '../UI/colorsPong';
import * as MUI from '../UI/MUIstyles';
import styles from './UI.module.css';
import { backendUrl } from '../../api/axios-instance';

const URL_LOGOUT = `${backendUrl}/auth/logout`;

const MenuBar = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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
            <Tooltip title="Open profile menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MoreVertIcon style={{ fill: color.PONG_WHITE }} />
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
                Statistics
              </MenuItem>
              <MenuItem onClick={() => authenticate()}>
                {user.provider ? 'Logout' : 'Login'}
              </MenuItem>
            </Menu>
          </Box>
        </div>
        <div className={styles.center}>
          {isSmallScreen ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon style={{ fill: color.PONG_WHITE }} />
            </IconButton>
          ) : (
            <>
              <Button variant="text">
                <NavLink to=".">Home</NavLink>
              </Button>
              <Button variant="text">
                <NavLink to="chat">Chat</NavLink>
              </Button>
              <Button variant="text">
                <NavLink to="game">Game</NavLink>
              </Button>
              <Button variant="text">
                <NavLink to="about">Info</NavLink>
              </Button>
            </>
          )}
        </div>
        <div className={styles.right}>
          <img
            src={require('../../assets/gameLogo.png')}
            alt=""
            className={styles.logo}
          />
        </div>
      </nav>
      <Drawer
        PaperProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <List sx={{ color: color.PONG_WHITE }}>
          <ListItem onClick={() => navigate('/')}>
            <ListItemText primary="Home" sx={MUI.burgerItem} />
          </ListItem>
          <ListItem onClick={() => navigate('/chat')}>
            <ListItemText primary="Chat" sx={MUI.burgerItem} />
          </ListItem>
          <ListItem onClick={() => navigate('/game')}>
            <ListItemText primary="Game" sx={MUI.burgerItem} />
          </ListItem>
          <ListItem onClick={() => navigate('/about')}>
            <ListItemText primary="Info" sx={MUI.burgerItem} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default MenuBar;
