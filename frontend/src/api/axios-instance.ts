import axios from 'axios';

const backendAPI = axios.create({
	baseURL: String(process.env.REACT_APP_URL_BACKEND),
	withCredentials: true,
	headers: { 'Content-type': 'application/json; charset=UTF-8' }
});

export default backendAPI;