import {NavLink} from "react-router-dom";

const Menu = () => {
  return (
    <nav>
      <NavLink to=".">Home</NavLink>
      <NavLink to="chat">Chat</NavLink>
      <NavLink to="game">Game</NavLink>
      <NavLink to="dashboard">Dashboard</NavLink>
      <NavLink to="login">Login</NavLink>
    </nav>
  )
}

export default Menu