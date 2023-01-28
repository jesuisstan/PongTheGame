import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
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
      <nav>
        <div className={styles.right}>
          <NavLink to=".">Home</NavLink>
          <NavLink to="chat">Chat</NavLink>
          <NavLink to="game">Game</NavLink>
          <NavLink to="dashboard">Dashboard</NavLink>
        </div>
        <div className={styles.left}>
          <Button>mini profile</Button>
          <Button variant="contained" onClick={authenticate}>
            {user.provider ? 'Logout' : 'Login'}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
