import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from 'passport';
import { TODO } from 'src/utils/todo';
import { AuthProvider } from '../auth.provider';

@Injectable()
export class GithubService implements AuthProvider {
  validateUser(profile: Profile): Promise<User> {
    return TODO();
  }
  createUser(profile: Profile): Promise<User> {
    return TODO();
  }
  findUser(profile: Profile): Promise<User | null> {
    return TODO();
  }
}
