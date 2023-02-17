import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import PleaseLogin from '../pages/PleaseLogin';

const Chat = () => {
  const { user, setUser } = useContext(UserContext);

  return !user.provider ? (
    <PleaseLogin />
  ) : (
    <div className="baseCard">
      <h1>Let's chat together right now</h1>
    </div>
  );
};

export default Chat;
