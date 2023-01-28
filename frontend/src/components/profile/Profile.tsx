import './Profile.css';
import { User } from '../../types/User';

const Profile = ({ user }: any) => {
  return (
    <>
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
    </>
  );
};

export default Profile;
