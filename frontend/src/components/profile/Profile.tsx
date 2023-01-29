import './Profile.css';
import Avatar from '@mui/material/Avatar';
import { User } from '../../types/User';

const Profile = ({ user }: any) => {
  return !user.provider ? (
    <h1>No user logged in</h1>
  ) : (
    <div className="profileCard">
      <div className="wrapper">
        <div className="left">
          <img
            className="avatarBig"
            src={user.avatar}
            alt="IMG"
          />
        </div>
        <div className="center">
          <div className="line" />
        </div>
        <div className="right">
          <div className="loginButton google">
            <img
              src={require('../../assets/google.png')}
              alt=""
              className="icon"
            />
            Google
          </div>

          <div className="loginButton github">
            <img
              src={require('../../assets/github.png')}
              alt=""
              className="icon"
            />
            Github
          </div>

          <div className="loginButton ecole">
            <img
              src={require('../../assets/ecole42.png')}
              alt=""
              className="icon"
            />
            Ecole 42
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

{
  /*<div>
      <h1>Profile page</h1>
      <h2>{user.displayName}</h2>
      <h2>{user.provider}</h2>
      <h3>{user.id}</h3>
      <img
        className="avatarBig"
        src={user.avatar}
        alt="IMG"
        width="150"
        height="150"
      />
    </div>*/
}
