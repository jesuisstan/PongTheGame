import axios from 'axios';

export const backendUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_URL_BACKEND
    : '/api';

const backendAPI = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: { 'Content-type': 'application/json; charset=UTF-8' }
});

export default backendAPI;
