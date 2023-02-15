import { io, Socket } from "socket.io-client";
import { createContext } from "react";

// Create a new websocket connected to the backend port 
export const socket = io('http://localhost:' + process.env.REACT_APP_BACKEND_PORT)
// Define context with the previous socket
export const WebSocketContext = createContext<Socket>(socket)
