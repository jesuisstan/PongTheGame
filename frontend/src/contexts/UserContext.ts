import { createContext } from 'react';
import { User } from '../types/User';

interface UserContextData {
	user: User;
	setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextData>({
    user: {
		id: -1,
		nickname: '',
		avatar: '',
		provider: '',
		username: '',
		tfa: false
	  },
	setUser: (user) => {},
});