import { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { LocationContext } from './contexts/LocationContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';
import Verify2fa from './components/profile/Verify2fa';
import backendAPI from './api/axios-instance';
import './App.css';
import AppRoutes from './AppRoutes';

const App = () => {
  const socket = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>({
    avatar: undefined,
    id: -1,
    nickname: '',
    profileId: '',
    provider: '',
    role: '',
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
          setOpen(true);
        }
      }
    );
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <Verify2fa open={open} setOpen={setOpen} />
            <AppRoutes />
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
};

export default App;
