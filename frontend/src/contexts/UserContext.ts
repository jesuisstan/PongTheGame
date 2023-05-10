import { createContext } from 'react';
import { User } from '../types/User';

interface UserContextData {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextData>({
  user: {
    avatar: undefined,
    id: -1,
    nickname: '',
    profileId: '',
    provider: '',
    status: 'OFFLINE',
    totpSecret: null,
    username: '',
    blockedUsers: [],
    blockedBy: []
  },
  setUser: (user) => {}
});
