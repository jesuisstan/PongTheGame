import { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { User } from './types/User';
import { Invitation } from './types/Invitation';
import { WebSocketContext } from './contexts/WebsocketContext';
import { GameResultContext } from './contexts/GameResultContext';
import { GameStatusContext } from './contexts/GameStatusContext';
import { GameResult, GameStatus } from './components/game/game.interface';
import { isUserBlocked } from './components/chat/utils/statusFunctions';
import AppRoutes from './AppRoutes';
import Verify2fa from './components/profile/Verify2fa';
import InvitationReceivedModal from './components/game/invitation/InvitationReceivedModal';
import backendAPI from './api/axios-instance';
import ResultsModal from './components/game/ResultsModal';
import WarningTokenModal from './components/UI/WarningTokenModal';
import WarningConnectedModal from './components/UI/WarningConnectedModal';
import WarningLoginModal from './components/UI/WarningLoginModal';
import errorAlert from './components/UI/errorAlert';
import './App.css';

const App = () => {
  const socket = useContext(WebSocketContext);
  const [openVerify2fa, setOpenVerify2fa] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  const [openWarningToken, setOpenWarningToken] = useState(false);
  const [openWarningConnected, setOpenWarningConnected] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [openResultsModal, setOpenResultsModal] = useState(false);
  const [openWarningLogin, setOpenWarningLogin] = useState(false);

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
    blockedBy: [],
    joinedChatRoom: undefined
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
    if (localStorage.getItem('logStatus')) {
      backendAPI.get('/auth/getuser').then(
        (response) => {
          setUser(response.data);
          localStorage.setItem('logStatus', 'true');
        },
        (error) => {
          if (error.response?.status === 400) {
            setOpenVerify2fa(true);
          } else if (error.response?.status === 401) {
            localStorage.removeItem('logStatus');
            setOpenWarningLogin(true);
          } else {
            localStorage.removeItem('logStatus');
            errorAlert('Something went wrong while logging in');
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    // Setup socket event listeners
    const handleInvitation = (args: any) => {
      if (isUserBlocked(user, null, args.from.nickname)) {
        socket.emit('match_invitation_refused', {
          nickname: args.from.nickname
        });
      } else {
        setInvitation(args);
        setOpenInvitation(true);
      }
    };
    
    const handleMatchSpecChangeState = (args: any) => {
      setGameStatus('lobby');
    };
  
    const handleErrorSocket = (args: any) => {
      if (args.message === 'You are already connected') {
        setOpenWarningConnected(true);
      } else {
        setOpenWarningToken(true);
      }
    };
    
    socket.on('invitation_game', handleInvitation);
    socket.on('match_spec_change_state', handleMatchSpecChangeState);
    socket.on('error_socket', handleErrorSocket);
  
    return () => {
      socket.off('invitation_game', handleInvitation);
      socket.off('match_spec_change_state', handleMatchSpecChangeState);
      socket.off('error_socket', handleErrorSocket);
      socket.disconnect();
    };
  }, []); 

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <GameStatusContext.Provider value={{ gameStatus, setGameStatus }}>
              <GameResultContext.Provider value={{ gameResult, setGameResult }}>
                <WarningLoginModal
                  open={openWarningLogin}
                  setOpen={setOpenWarningLogin}
                />
                <Verify2fa open={openVerify2fa} setOpen={setOpenVerify2fa} />
                <InvitationReceivedModal
                  open={openInvitation}
                  setOpen={setOpenInvitation}
                  invitation={invitation}
                />
                <WarningTokenModal
                  open={openWarningToken}
                  setOpen={setOpenWarningToken}
                />
                <WarningConnectedModal
                  open={openWarningConnected}
                  setOpen={setOpenWarningConnected}
                />
                {gameStatus === GameStatus.ENDED && (
                  <ResultsModal
                    open={!openResultsModal}
                    setOpen={setOpenResultsModal}
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
