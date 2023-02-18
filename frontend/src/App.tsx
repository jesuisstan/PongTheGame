import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './contexts/UserContext';
import { User } from './types/User';
import MainLayout from './components/UI/MainLayout';
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import Validate2fa from './components/profile/Validate2fa';
import './App.css';
import { WebSocketContext } from './contexts/WebsocketContext';

function App() {

  // Fetching the socket from its context
  const socket = useContext(WebSocketContext)
  const [open, setOpen] = useState(false);
  const [tmpUser, setTmpUser] = useState(null);

  const [user, setUser] = useState<User>({
    id: -1,
    nickname: '',
    avatar: '',
    provider: '',
    username: '',
    tfa: false
  });

  //useEffect(() => {
  //  axios
  //    .get(String(process.env.REACT_APP_URL_AUTH), { withCredentials: true })
  //    .then(
  //      (response) => setUser(response.data),
  //      (error) => console.log(error)
  //    );
  //}, []);

  useEffect(() => {
    axios
      .get(String(process.env.REACT_APP_URL_AUTH), { withCredentials: true })
      .then(
        (response) => {
          //let flag_validated = false
          if (response.data.tfa) {
            setTmpUser(response.data);

            setOpen(true);
          } else setUser(response.data);
        },
        (error) => console.log(error)
      );
  }, []);

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);

  // Fetching the socket from its context
  // const socket = useContext(WebSocketContext)

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
                <Route
                  path="profile"
                  element={user.provider ? <Profile /> : <Navigate to="/login" />}
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
