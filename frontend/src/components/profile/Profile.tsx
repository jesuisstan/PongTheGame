import './Profile.css';
import Avatar from '@mui/material/Avatar';
import { User } from '../../types/User';

const Profile = ({ user }: any) => {
  return !user.provider ? (
    <h1>No user logged in</h1>
  ) : (
    <div className="profileCard">
      <div className="left">
        <img className="avatarBig" src={user.photos[0].value} alt="IMG" />
      </div>
      <div className="center">
        <div className="line" />
      </div>
      <div className="right">
        <p>login: {user.username}</p>
        <p>user name: {user.displayName}</p>
        <p>logged in with {user.provider}</p>
      </div>
    </div>
  );
};

export default Profile;
