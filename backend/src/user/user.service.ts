import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        avatar: true,
        id: true,
        profileId: true,
        provider: true,
        nickname: true,
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
      },
    });

    // const profile = await this.prisma.user.findUnique({
    //   where: {
    //     profileId_provider: {
    //       profileId,
    //       provider,
    //     },
    //   },
    //   select: {
    //     user: {
    //       select: {
    //         avatar: true,
    //         id: true,
    //         nickname: true,
    //         profile: true,
    //         profileId: true,
    //         profileProvider: true,
    //       },
    //     },
    //   },
    // });
    // return profile?.user ?? null;
  }

  async createUser(
    profileId: string,
    provider: string,
    displayName: string,
    avatar: string | null,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        nickname: displayName,
        profileId,
        provider,
        avatar,
      },
      select: {
        avatar: true,
        id: true,
        nickname: true,
        profileId: true,
        provider: true,
      },
    });
  }
}
