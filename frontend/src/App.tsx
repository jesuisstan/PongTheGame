import { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';
import AppRoutes from './AppRoutes';
import Verify2fa from './components/profile/Verify2fa';
import InvitationReceivedModal from './components/player_card/invitation/InvitationReceivedModal';
import backendAPI from './api/axios-instance';
import './App.css';

const App = () => {
  const socket = useContext(WebSocketContext);
  const [openVerify2fa, setOpenVerify2fa] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);

  const [user, setUser] = useState<User>({
    avatar: undefined,
    id: -1,
    nickname: '',
    profileId: '',
    provider: '',
    role: '',
    status: 'OFFLINE',
    totpSecret: null,
    username: '',
    blockedUsers: [],
    joinedChatRoom: ''
  });

  useEffect(() => {
    backendAPI.get('/auth/getuser').then(
      (response) => {
        setUser(response.data);
      },
      (error) => {
        if (error.response?.status === 400) {
          setOpenVerify2fa(true);
        }
      }
    );
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <Verify2fa open={openVerify2fa} setOpen={setOpenVerify2fa} />
            <InvitationReceivedModal
              open={openInvitation}
              setOpen={setOpenInvitation}
            />
            <AppRoutes />
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
};

export default App;
