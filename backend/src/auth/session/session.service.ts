import { Injectable } from '@nestjs/common';
import { User, Stats } from '@prisma/client';
import { Profile } from 'passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionService {
  constructor(private readonly users: UserService) {}

  async validateUser(profile: Profile): Promise<User> {
    const user: User = await this.createUser(profile);
    await this.createStats(user.id);
    return (await this.findUser(profile)) ?? user;
  }

  async createStats(UserId: number): Promise<Stats> {
    return this.users.createStats(UserId);
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
