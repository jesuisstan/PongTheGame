import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { WebSocketContext } from './contexts/WebsocketContext';
import { User } from './types/User';
import MainLayout from './components/UI/MainLayout';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import Validate2fa from './components/profile/Validate2fa';
import History from './components/pages/History';
import backendAPI from './api/axios-instance'
import './App.css';

const URL_GET_USER = String(process.env.REACT_APP_URL_GET_USER);

function App() {
  // Fetching the socket from its context
  const socket = useContext(WebSocketContext);
  const [open, setOpen] = useState(false);
  const [tmpUser, setTmpUser] = useState<User | undefined>();
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
        if (
          //todo change !response.data.tfa back to response.data.tf
          !response.data.totpEnabled &&
          localStorage.getItem('totpVerified') !== 'true'
        ) {
          setTmpUser(response.data);
          setOpen(true);
        } else setUser(response.data);
      },
      (error) => {
        console.log(error);
        localStorage.removeItem('totpVerified');
      }
    );
  }, []);

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);
  console.log('totpVerified ?? -> ' + localStorage.getItem('totpVerified'));

  return (
    <WebSocketContext.Provider value={socket}>
      <BrowserRouter>
        <div className="App">
          <UserContext.Provider value={{ user, setUser }}>
            <Validate2fa open={open} setOpen={setOpen} userData={tmpUser} />
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
