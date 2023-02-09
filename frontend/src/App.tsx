import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound';
import MainLayout from './components/layouts/MainLayout';
import { User } from './types/User';
import './App.css';

const url = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/auth/getuser';

function App() {
  const [user, setUser] = useState<User>({
    id: -1,
    displayName: '',
    avatar: '',
    provider: '',
    username: ''
  });

  useEffect(() => {
    fetch(url, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        console.log("res has");
        console.log(res);

        
        setUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout user={user} />}>
            <Route index={true} element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route
              path="chat"
              element={user.provider ? <Chat user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="game"
              element={user.provider ? <Game /> : <Navigate to="/login" />}
            />
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
