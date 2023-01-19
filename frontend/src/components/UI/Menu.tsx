import {NavLink} from "react-router-dom";


const Menu = () => {
  return (
    <nav>
      <NavLink to=".">Home</NavLink>
      <NavLink to="profile">Profile</NavLink>
      <NavLink to="game">Game</NavLink>
      <NavLink to="chat">Chat</NavLink>
    </nav>
  )
}

export default Menu