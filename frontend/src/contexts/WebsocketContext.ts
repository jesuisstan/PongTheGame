import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

function get_cookie_access_token() {
  const cookies: string[] = document.cookie.split('=');
  if (cookies[0] !== 'access_token') return null;
  return cookies[1];
}

const opts = {
  auth: {
    token: get_cookie_access_token()
  }
};

// // Create a new websocket connected to the backend
export const socket =
  process.env.NODE_ENV === 'development'
    ? io(process.env.REACT_APP_URL_BACKEND, opts)
    : io(opts);

// Define context with the previous socket
export const WebSocketContext = createContext<Socket>(socket);
