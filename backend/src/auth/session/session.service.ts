import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from 'passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionService {
  constructor(private readonly users: UserService) {}

  async validateUser(profile: Profile): Promise<User> {
    return (await this.findUser(profile)) ?? this.createUser(profile);
  }

  async createUser(profile: Profile): Promise<User> {
    const { id, displayName: username, provider, photos } = profile;
    const avatar = photos?.[0].value ?? null;

    console.log(profile);

    return this.users.createUser(id, provider, username, avatar ?? null);
  }

  async findUser(profile: Profile): Promise<User | null> {
    return this.users.findUserByProfileId(profile.provider, profile.id);
  }
}
