import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        avatar: true,
        id: true,
        profileId: true,
        provider: true,
        nickname: true,
        username: true,
      },
    });
  }

  async findUserByNickname(nickname: string) {
    return this.prisma.user.findUnique({
      where: { nickname },
      select: {
        avatar: true,
        id: true,
        profileId: true,
        provider: true,
        nickname: true,
        username: true,
      },
    });
  }

  async findUserByProfileId(
    provider: string,
    profileId: string,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        profileId_provider: {
          profileId,
          provider,
        },
      },
      select: {
        avatar: true,
        id: true,
        nickname: true,
        profileId: true,
        provider: true,
        username: true,
      },
    });
  }

  async createUser(
    profileId: string,
    provider: string,
    username: string,
    avatar: string | null,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        profileId,
        username,
        provider,
        avatar,
      },
      select: {
        avatar: true,
        id: true,
        username: true,
        nickname: true,
        profileId: true,
        provider: true,
      },
    });
  }

  async findUsersById(...ids: number[]): Promise<(User | null)[]> {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        avatar: true,
        id: true,
        profileId: true,
        provider: true,
        nickname: true,
        username: true,
      },
    });

    return ids.map((id) => {
      return users.find((user) => user.id == id) ?? null;
    });
  }

  async setUserNickname(user: User, nickname: string): Promise<User> {
    const { id } = user;

    return this.prisma.user.update({
      data: {
        nickname,
      },
      where: {
        id,
      },
    });
  }
}
