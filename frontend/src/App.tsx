import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/profile/Login";
import Game from "./components/game/Game";
import Chat from "./components/chat/Chat";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import NotFound from "./components/NotFound";
import MainLayout from "./components/layouts/MainLayout";
import './App.css';
import {User} from "./types/User";
const _ = require('lodash');

const url = "http://localhost:3080/auth/getuser";

function App() {
  const [user, setUser] = useState<User>({
    id: -1,
    displayName: '',
    photos: [{}],
    provider: ''
  });
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        let {id, displayName, photos, provider} = res
        let temp:User = {id, displayName, photos, provider}
        setUser(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  user.provider ? console.log('user logged in') : console.log("no user")
  
  console.log(user.id)
  console.log(user.displayName)
  console.log(user.photos)
  console.log(user.provider)
  console.log(user)
  
  return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout user={user}/>}>
              <Route index={true} element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="chat" element={user.provider ? <Chat /> : <Navigate to="/login" />} />
              <Route path="game" element={user.provider ? <Game /> : <Navigate to="/login" />} />
              <Route path="dashboard" element={user.provider ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="profile" element={<Profile user={user}/>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
