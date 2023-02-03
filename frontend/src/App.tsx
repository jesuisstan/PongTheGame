import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound';
import MainLayout from './components/UI/MainLayout';
import { User } from './types/User';
import './App.css';


const url = 'http://localhost:3080/auth/getuser';
const urlSetNickname = 'http://localhost:3080/user/setnickname';

function App() {
  const [user, setUser] = useState<User>({
    id: -1,
    nickname: '',
    avatar: '',
    provider: '',
    username: ''
  });

  const setNickname = (value: string) => {
    //setUser({...user, nickname: value })
    fetch(urlSetNickname, { method: 'PATCH' })
      .then((res) => res.json())
      .then((res) => {
        //setUser(res);
        console.log("nick setted"); //todo
      })
      .catch((err) => {
        console.log(err);
      });
 }

  useEffect(() => {
    fetch(url, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        setUser(res);
        console.log("useEffect runs"); //todo
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
            <Route path="login" element={<Login user={user}/>} />
            <Route
              path="chat"
              element={user.provider ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="game"
              element={user.provider ? <Game /> : <Navigate to="/login" />}
            />
            <Route path="profile" element={<Profile user={user} setNickname={setNickname}/>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
