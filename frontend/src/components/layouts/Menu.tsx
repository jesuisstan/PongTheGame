import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Menu.module.css';

const Menu = ({ user }: any) => {
  const authenticate = () => {
    if (user.provider) {
      window.open('http://localhost:3080/auth/logout', '_self');
    } else {
      window.open('http://localhost:3000/login', '_self');
    }
  };

  return (
    <div>
      <nav className={styles.navigate}>
        <div className={styles.right}>
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
        <div className={styles.left}>
          <Button variant="contained" onClick={authenticate}>
            {user.provider ? 'Logout' : 'Login'}
          </Button>
          <Avatar alt="" src={user.avatar}></Avatar>
          <Button variant="text">
            <NavLink to="profile">Profile</NavLink>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
