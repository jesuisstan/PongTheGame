import { Injectable } from '@nestjs/common';
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
        profile: true,
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
        profile: true,
        nickname: true,
      },
    });
  }

  async findUserByProfileId(provider: string, profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        profileId_provider: {
          profileId,
          provider,
        },
      },
      select: {
        user: {
          select: {
            avatar: true,
            id: true,
            nickname: true,
            profile: true,
          },
        },
      },
    });

    return profile?.user ?? null;
  }
}
