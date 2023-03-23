import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from 'passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionService {
  constructor(private readonly users: UserService) {}

  async validateUser(profile: Profile): Promise<User> {
    return (await this.findUser(profile)) ?? this.createUser(profile);
  }

  async createUser(profile: Profile): Promise<User> {
    const { id, provider, photos } = profile;
    let username: any = profile.displayName;
    if (username == null) username = profile.username;
    const avatar = photos?.[0].value ?? null;
    return this.users.createUser(id, provider, username, avatar ?? null);
  }

  async findUser(profile: Profile): Promise<User | null> {
    return this.users.findUserByProfileId(profile.provider, profile.id);
  }
}
