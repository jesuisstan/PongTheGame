import { io, Socket } from "socket.io-client";
import { createContext } from "react";

function get_cookie_access_token()
{
    const cookies : string[] = document.cookie.split("=");
    if (cookies[0] !== "access_token")
        return (null);
    return (cookies[1]);
}

// Create a new websocket connected to the backend port 
export const socket = io('http://localhost:' + process.env.REACT_APP_BACKEND_PORT, {
    auth : {token : get_cookie_access_token()},
})
// Define context with the previous socket
export const WebSocketContext = createContext<Socket>(socket)
