import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const USER_SELECT = {
  avatar: true,
  id: true,
  profileId: true,
  provider: true,
  nickname: true,
  username: true,
  // blockedUsers: true,
  role: true,
};

function userSelect(includeTfaEnabled: boolean) {
  return includeTfaEnabled
    ? {
        ...USER_SELECT,
        totpSecret: {
          select: {
            verified: includeTfaEnabled,
          },
        },
      }
    : USER_SELECT;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(
    id: number,
    includeTfaEnabled = false,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userSelect(includeTfaEnabled),
    });
  }

  async findUserByNickname(nickname: string, includeTfaEnabled = false) {
    return this.prisma.user.findUnique({
      where: { nickname },
      select: userSelect(includeTfaEnabled),
    });
  }

  async findUserByProfileId(
    provider: string,
    profileId: string,
    includeTfaEnabled = false,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        profileId_provider: {
          profileId,
          provider,
        },
      },
      select: userSelect(includeTfaEnabled),
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
        provider,
        username,
        avatar,
      },
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
      select: userSelect(true),
    });
  }

  async hasTotpSecret(user: User): Promise<boolean> {
    const { id } = user;

    const dbUser = await this.prisma.user.findFirst({
      where: { id },
      select: {
        totpSecret: true,
      },
    });

    return dbUser?.totpSecret?.verified ?? false;
  }

  async setAvatar(user: User, url: string | null): Promise<User> {
    const { id } = user;

    return this.prisma.user.update({
      data: {
        avatar: url,
      },
      where: {
        id,
      },
      select: userSelect(true),
    });
  }

  async setTotpSecret(user: User, secret: string): Promise<User> {
    const { id } = user;

    return this.prisma.user.update({
      data: {
        totpSecret: {
          upsert: {
            create: { secret },
            update: { secret },
          },
        },
      },
      where: { id },
      select: userSelect(true),
    });
  }

  async removeTotpSecret(user: User): Promise<User> {
    const { id } = user;

    return this.prisma.user.update({
      data: {
        totpSecret: {
          delete: true,
        },
      },
      where: { id },
      select: userSelect(true),
    });
  }
}
