import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './context/UserContext';
import { User } from './types/User';
import Home from './components/pages/Home';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import NotFound from './components/pages/NotFound';
import MainLayout from './components/UI/MainLayout';
import './App.css';

function App() {
  const [user, setUser] = useState<User>({
    id: -1,
    nickname: '',
    avatar: '',
    provider: '',
    username: '',
    TFAuth: false
  });

  useEffect(() => {
    axios
      .get(String(process.env.REACT_APP_URL_AUTH), { withCredentials: true })
      .then(
        (response) => setUser(response.data),
        (error) => console.log(error)
      );
  }, []);

  user.provider ? console.log('user logged in') : console.log('no user');
  console.log(user);

  return (
    <BrowserRouter>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index={true} element={<Home />} />
              <Route
                path="login"
                element={
                  !user.provider ? (
                    <Login />
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
                    <Profile />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
