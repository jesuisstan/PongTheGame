import { io, Socket } from "socket.io-client";
import { createContext } from "react";

// Create a new websocket connected to the backend port 
export const socket = io('http://localhost:' + process.env.REACT_APP_BACKEND_PORT)
// Define context with the previous socket
export const WebSocketContext = createContext<Socket>(socket)
// Use the context as  a provider to make it subscribable by other components
export const WebSocketProvider = WebSocketContext.Provider