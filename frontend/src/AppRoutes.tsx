import { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { WebSocketContext } from './contexts/WebsocketContext';
import { UserContext } from './contexts/UserContext';
import MainLayout from './components/UI/MainLayout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/profile/Login';
import Profile from './components/profile/Profile';
import Chat from './components/chat/Chat';
import Game from './components/game/Game';
import NotFound from './components/pages/NotFound';
import PleaseLogin from './components/pages/PleaseLogin';
import PlayerCard from './components/player_card/PlayerCard';
import './App.css';

const AppRoutes = () => {
  const { user } = useContext(UserContext);
  const socket = useContext(WebSocketContext);
  const location = useLocation();

  useEffect(() => {
    if (user.provider && user.nickname) {
      if (location.pathname !== '/game') {
        socket.emit('match_leave', { nickname: user.nickname });
        socket.emit('match_spectate_leave');
      }
    }
  }, [location, user]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index={true} element={<Home />} />
        <Route
          path="login"
          element={!user.provider ? <Login /> : <Navigate to="/profile" />}
        />
        <Route path="chat" element={<Chat />} />
        <Route path="game" element={<Game />} />
        <Route path="about" element={<About />} />
        <Route
          path="profile"
          element={user.provider ? <Profile /> : <PleaseLogin />}
        />
        <Route path="players/*">
          <Route path="" element={<NotFound />} />
          <Route
            path=":playerNickname"
            element={user.provider ? <PlayerCard /> : <PleaseLogin />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />*
      </Route>
    </Routes>
  );
};

export default AppRoutes;
// THe only problem i just need to know if the player is on game
