import {NavLink} from "react-router-dom"
import "./Menu.css"
import {User} from "../../types/User";
const _ = require('lodash')
const Menu = ({user} : any) => {
  const authenticate = () => {
    if (user) {
      window.open("http://localhost:3080/auth/logout", "_self")
    } else {
      window.open("http://localhost:3000/login", "_self");
    }
  }

  return (
    <div>
      <nav>
        <NavLink to=".">Home</NavLink>
        <NavLink to="chat">Chat</NavLink>
        <NavLink to="game">Game</NavLink>
        <NavLink to="dashboard">Dashboard</NavLink>
        <NavLink to="login"
                 className="authButton"
                 onClick={authenticate}
        >
          {user.provider ? 'Logout' : 'Login'}
        </NavLink>
      </nav>
    </div>
  )
}

export default Menu