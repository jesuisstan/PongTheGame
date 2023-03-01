import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import backendAPI from './api/axios-instance';
import './App.css';
import Chat from './components/chat/Chat';
import Game from './components/game/Game';
import History from './components/pages/History';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Login from './components/profile/Login';
import Profile from './components/profile/Profile';
import Validate2fa from './components/profile/Validate2fa';
import MainLayout from './components/UI/MainLayout';
import { UserContext } from './contexts/UserContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';

const URL_GET_USER = String(process.env.REACT_APP_URL_GET_USER);

function App() {
  // Fetching the socket from its context
  const socket = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>({
    id: -1,
    nickname: '',
    avatar: '',
    provider: '',
    username: '',
    totpEnabled: false
  });

  useEffect(() => {
    backendAPI.get(URL_GET_USER).then(
      (response) => {
        setUser(response.data);
      },
      (error) => {
        if (error.response?.status === 400) {
          //setTmpUser(error?.response?.data);
          setOpen(true);
          // 2fa is enabled and was not verified
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
            <Validate2fa open={open} setOpen={setOpen} />
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
                <Route path="history" element={<History />} />
                <Route
                  path="profile"
                  element={user.provider ? <Profile /> : <Login />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </UserContext.Provider>
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  );
}

export default App;
