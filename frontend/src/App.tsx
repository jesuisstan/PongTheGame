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
  const [user, setUser] = useState({});
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => setUser(res))
      .catch(err => {
        console.log(err)
      })
  }, [])

  !_.isEmpty(user) ? console.log('user logged in') : console.log("no user")
  console.log(user)

  return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout user={user}/>}>
              <Route index={true} element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="chat" element={!_.isEmpty(user) ? <Chat /> : <Navigate to="/login" />} />
              <Route path="game" element={!_.isEmpty(user) ? <Game /> : <Navigate to="/login" />} />
              <Route path="dashboard" element={!_.isEmpty(user) ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
