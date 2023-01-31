import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from 'passport';
import { TODO } from 'src/utils/todo';
import { AuthProvider } from '../auth.provider';

@Injectable()
export class Auth42Service implements AuthProvider {
  async validateUser(profile: Profile): Promise<User> {
    return TODO();
  }

  async createUser(profile: Profile): Promise<User> {
    return TODO();
  }

  async findUser(profile: Profile): Promise<User | null> {
    return TODO();
  }
}
