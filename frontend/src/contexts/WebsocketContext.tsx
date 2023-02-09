import { io, Socket } from "socket.io-client";
import { createContext } from "react";

export const socket = io('http://localhost:3080')
export const WebSocketContext = createContext<Socket>(socket)
export const WebSocketProvider = WebSocketContext.Provider