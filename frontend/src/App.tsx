import { useContext, useEffect, useState } from 'react';
import { Navigate, BrowserRouter } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { User } from './types/User';
import { Invitation } from './types/Invitation';
import { WebSocketContext } from './contexts/WebsocketContext';
import { GameResultContext } from './contexts/GameResultContext';
import { GameStatusContext } from './contexts/GameStatusContext';
import { GameResult, GameStatus } from './components/game/game.interface';
import AppRoutes from './AppRoutes';
import Verify2fa from './components/profile/Verify2fa';
import InvitationReceivedModal from './components/game/invitation/InvitationReceivedModal';
import backendAPI from './api/axios-instance';
import VictoryModal from './components/game/VictoryModal';
import WarningModal from './components/UI/WarningModal';
import './App.css';

const App = () => {
  const socket = useContext(WebSocketContext);
  const [openVerify2fa, setOpenVerify2fa] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [openVictoryModal, setOpenVictoryModal] = useState(false);

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
    joinedChatRoom: undefined,
  });

  const [gameStatus, setGameStatus] = useState('lobby');

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

  socket.on("match_spec_change_state", (args)=> {
    setGameStatus('lobby')
  })

  socket.on('error_socket', (args) => {
    console.log(args.message); // TODO Check how to do that
    setOpenWarning(true);
  });

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <GameStatusContext.Provider value={{ gameStatus, setGameStatus }}>
              <GameResultContext.Provider value={{ gameResult, setGameResult }}>
                <Verify2fa open={openVerify2fa} setOpen={setOpenVerify2fa} />
                <InvitationReceivedModal
                  open={openInvitation}
                  setOpen={setOpenInvitation}
                  invitation={invitation}
                />
                {<WarningModal open={openWarning} setOpen={setOpenWarning} />}
                {gameStatus === GameStatus.ENDED && (
                  <VictoryModal
                    open={!openVictoryModal}
                    setOpen={setOpenVictoryModal}
                    gameResult={gameResult}
                  />
                )}
                <AppRoutes />
              </GameResultContext.Provider>
            </GameStatusContext.Provider>
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
};

export default App;
