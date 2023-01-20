import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/game/Game";
import Chat from "./components/chat/Chat";
import Profile from "./components/profile/Profile";
import NotFound from "./components/NotFound";
import MainLayout from "./layouts/MainLayout";
import './App.css';

function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index={true} element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="game" element={<Game />} />
              <Route path="chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
