import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Home from './components/Home';
import Login from './components/profile/Login';
import Game from './components/game/Game';
import Chat from './components/chat/Chat';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound';
import MainLayout from './components/UI/MainLayout';
import { User } from './types/User';
import './App.css';

const urlAuth = 'http://localhost:3080/auth/getuser';
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
    return axios
      .patch(
        urlSetNickname,
        { nickname: value },
        {
          withCredentials: true,
          headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }
      )
      .then(
        (response) => {
          setUser(response.data);
        },
        (error) => {
          console.log(error);
          Swal.fire({
            showConfirmButton: false,
            icon: 'error',
            iconColor: '#fd5087',
            width: 450,
            title: 'Oops...',
            text: 'This nickname is already used',
            showCloseButton: true,
            color: 'whitesmoke',
            background: 'black'
          });
        }
      );
  };

  useEffect(() => {
    axios.get(urlAuth, { withCredentials: true }).then(
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
            <Route path="login" element={<Login user={user} />} />
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
              element={<Profile user={user} setNickname={setNickname} />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
