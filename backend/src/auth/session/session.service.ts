import { Injectable } from '@nestjs/common';
import { User, Stats } from '@prisma/client';
import { Profile } from 'passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionService {
  constructor(private readonly users: UserService) {}

  async validateUser(profile: Profile): Promise<User> {
    const user: User = await this.createUser(profile);
    console.log('gonna create stats');
    await this.createStats(user.id); // MEMO Stats is not create check why
    return (await this.findUser(profile)) ?? user;
  }

  async createStats(UserId: number): Promise<Stats> {
    // MEMO check if i keep that
    return this.users.createStats(UserId);
  }

  async createUser(profile: Profile): Promise<User> {
    const { id, displayName: username, provider, photos } = profile;
    const avatar = photos?.[0].value ?? null;

    return this.users.createUser(id, provider, username, avatar ?? null);
  }

  async findUser(profile: Profile): Promise<User | null> {
    return this.users.findUserByProfileId(profile.provider, profile.id);
  }
}
