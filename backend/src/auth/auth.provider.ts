import { User } from '@prisma/client';
import { Profile } from 'passport';

export interface AuthProvider {
  validateUser(profile: Profile): Promise<User>;
  createUser(profile: Profile): Promise<User>;
  findUser(profile: Profile): Promise<User | null>;
}

export const AuthProvider = Symbol('AuthProvider');
