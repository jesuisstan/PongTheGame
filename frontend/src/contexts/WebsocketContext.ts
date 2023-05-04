import { io, Socket } from 'socket.io-client';
import { createContext } from 'react';

function get_cookie_access_token() {
  const cookies: string[] = document.cookie.split('=');
  if (cookies[0] !== 'access_token') return null;
  const token = cookies[1];
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) return null; // check if the token is expired
    return token;
  } catch (e) {
    return null;
  }
}

// Create a new websocket connected to the backend port
export const socket = io(process.env.REACT_APP_URL_BACKEND, {
  auth: { token: get_cookie_access_token() }
});
// Define context with the previous socket
export const WebSocketContext = createContext<Socket>(socket);
