import { useContext, useEffect, useState } from 'react';
import { Navigate, BrowserRouter } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';
import { Invitation } from './types/Invitation';
import AppRoutes from './AppRoutes';
import Verify2fa from './components/profile/Verify2fa';
import InvitationReceivedModal from './components/game/invitation/InvitationReceivedModal';
import backendAPI from './api/axios-instance';
import './App.css';
import { GameStateContext } from './contexts/GameStateContext';

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

  const [gameState, setGameState] = useState('lobby');

  const [invitation, setInvitation] = useState<Invitation>({
    from: {
      nickname: undefined,
      avatar: undefined
    },
    gameInfo: {
      obstacle: undefined,
      winScore: undefined
    }
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

  socket.on('invitation_game', (args) => {
    setInvitation(args);
    setOpenInvitation(true);
  });

  socket.on('error_token', (args) => {
    alert(args.message); // TODO Check how to do that
    console.log(args);
  });

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <GameStateContext.Provider value={{ gameState, setGameState }}>
              <Verify2fa open={openVerify2fa} setOpen={setOpenVerify2fa} />
              <InvitationReceivedModal
                open={openInvitation}
                setOpen={setOpenInvitation}
                invitation={invitation}
              />
              <AppRoutes />
            </GameStateContext.Provider>
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
};

export default App;
