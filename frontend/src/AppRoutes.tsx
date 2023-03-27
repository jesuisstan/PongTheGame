import { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { LocationContext } from './contexts/LocationContext';
import MainLayout from './components/UI/MainLayout';
import Home from './components/pages/Home';
import Login from './components/profile/Login';
import Profile from './components/profile/Profile';
import Chat from './components/chat/Chat';
import Game from './components/game/Game';
import NotFound from './components/pages/NotFound';
import PleaseLogin from './components/pages/PleaseLogin';
import PlayerCard from './components/pages/player_page/PlayerCard';
import './App.css';

function AppRoutes() {
  const { user } = useContext(UserContext);

  const location = useLocation();
  const [locationPath, setLocationPath] = useState('');

  useEffect(() => {
    // Perform necessary actions when the location changes
    console.log(`Location changed to ${location.pathname}`);
    setLocationPath(location.pathname);
  }, [location]);

  return (
    <LocationContext.Provider value={{ locationPath }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index={true} element={<Home />} />
          <Route
            path="login"
            element={!user.provider ? <Login /> : <Navigate to="/profile" />}
          />
          <Route path="chat" element={<Chat />} />
          <Route path="game" element={<Game />} />
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
    </LocationContext.Provider>
  );
}

export default AppRoutes;
