import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { User } from '@prisma/client';
@Injectable()
export class FriendService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievement: giveAchievementService,
  ) {}

  async getAllFriendsFromUser(user: User) {
    return this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        friends: true,
      },
    });
  }

  async getFriendsFromNickname(nickname: string) {
    return this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      select: {
        friends: true,
      },
    });
  }

  async addFriendsByNickname(user: User, nickname: string) {
    const userToAdd: User | null = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
    if (!userToAdd) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          connect: {
            nickname: nickname,
          },
        },
      },
    });
    this.achievement.getAchievement(user);
  }

  async addFriendsById(user: User, id: number) {
    const userToAdd: User | null = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userToAdd) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          connect: {
            id: id,
          },
        },
      },
    });
    this.achievement.getAchievement(user);
  }

  async removeFriendsById(user: User, id: number) {
    const userToRemove: User | null = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userToRemove) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          disconnect: {
            id: id,
          },
        },
      },
    });
  }

  async removeFriendsByNickname(user: User, nickname: string) {
    const userToRemove: User | null = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
    if (!userToRemove) throw new NotFoundException('User not found');
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          disconnect: {
            nickname: nickname,
          },
        },
      },
    });
  }
}
