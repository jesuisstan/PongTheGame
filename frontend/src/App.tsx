import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';
import MainLayout from './components/UI/MainLayout';
import Home from './components/pages/Home';
import Login from './components/profile/Login';
import Profile from './components/profile/Profile';
import Verify2fa from './components/profile/Verify2fa';
import Chat from './components/chat/Chat';
import Game from './components/game/Game';
import NotFound from './components/pages/NotFound';
import PleaseLogin from './components/pages/PleaseLogin';
import PlayerCard from './components/pages/player_page/PlayerCard';
import backendAPI from './api/axios-instance';
import './App.css';

function App() {
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

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <Verify2fa open={open} setOpen={setOpen} />
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index={true} element={<Home />} />
                <Route
                  path="login"
                  element={
                    !user.provider ? <Login /> : <Navigate to="/profile" />
                  }
                />
                <Route path="chat" element={<Chat />} />
                <Route path="game" element={<Game />} />
                <Route
                  path="profile"
                  element={user.provider ? <Profile /> : <PleaseLogin />}
                />
                <Route path="players" element={<PlayerCard />}>
                  <Route
                    path=":playerNickname"
                    element={user.provider ? <PlayerCard /> : <PleaseLogin />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />*
              </Route>
            </Routes>
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
}

export default App;
