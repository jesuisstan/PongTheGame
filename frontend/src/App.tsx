import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound';
import MainLayout from './components/UI/MainLayout';
import { User } from './types/User';
import './App.css';

const URL_AUTH = 'http://localhost:3080/auth/getuser';

function App() {
  const [user, setUser] = useState<User>({
    id: -1,
    nickname: '',
    avatar: '',
    provider: '',
    username: ''
  });

  useEffect(() => {
    axios.get(URL_AUTH, { withCredentials: true }).then(
      (response) => setUser(response.data),
      (error) => console.log(error)
    );
  }, []);

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout user={user} />}>
            <Route index={true} element={<Home />} />
            <Route
              path="login"
              element={
                !user.provider ? (
                  <Login user={user} />
                ) : (
                  <Navigate to="/profile" />
                )
              }
            />
            <Route
              path="chat"
              element={user.provider ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="game"
              element={user.provider ? <Game /> : <Navigate to="/login" />}
            />
            <Route
              path="profile"
              element={
                user.provider ? (
                  <Profile user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
