import {NavLink} from "react-router-dom";

const Menu = ({user} : any) => {
  return (
    <nav>
      <NavLink to=".">Home</NavLink>
      <NavLink to="chat">Chat</NavLink>
      <NavLink to="game">Game</NavLink>
      <NavLink to="dashboard">Dashboard</NavLink>
      <NavLink to="login" className="log">{user ? 'Logout' : 'Login'}</NavLink>
    </nav>
  )
}

export default Menu