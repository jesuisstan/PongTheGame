import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Achievement } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AchievementDTO } from 'src/achievement/dto/achievement.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prisma: PrismaService) {}

  async allAchievement(): Promise<
    { id: number; Name: string; Description: string }[]
  > {
    const all_achievement = this.prisma.achievement.findMany({
      select: {
        id: true,
        Name: true,
        Description: true,
      },
    });
    return all_achievement;
  }

  async addAchievement(dto: AchievementDTO): Promise<{ id: number }> {
    try {
      const achievement: Achievement = await this.prisma.achievement.create({
        data: {
          Name: dto.Name,
          Title: dto.Title,
          Description: dto.Description,
        },
      });
      return { id: achievement.id };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('Achievement Exist');
        }
      }
      throw error;
    }
  }

  async updateAchievement(achId: number, data: AchievementDTO): Promise<void> {
    try {
      await this.prisma.achievement.update({
        where: {
          id: achId,
        },
        data: data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025')
          throw new NotFoundException('Achievement not found');
      }
    }
  }

  async deleteAchievement(achId: number): Promise<void> {
    try {
      await this.prisma.achievement.delete({
        where: {
          id: achId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025')
          throw new NotFoundException('Achievement not found');
      }
    }
    return;
  }

  async userAchievement(
    Nickname: string,
  ): Promise<{ achievement: Achievement[] }> {
    const nickname_user = await this.prisma.user.findUnique({
      where: {
        nickname: Nickname,
      },
      select: {
        id: true,
      },
    });
    if (!nickname_user) throw new NotFoundException('User not found');
    const achievement = await this.prisma.userAchivement.findMany({
      where: {
        userId: nickname_user.id,
      },
      select: {
        achievement: true,
        userId: true,
      },
    });
    if (!achievement) throw new NotFoundException('User not found');
    const ret: Achievement[] = [];
    for (let i = 0; i < achievement.length; i++) {
      if (
        !this.alreadyAchievement(ret, achievement[i].achievement.id) &&
        achievement[i].userId == nickname_user.id
      )
        ret.push(achievement[i].achievement);
    }
    return { achievement: ret };
  }

  alreadyAchievement(ret: Achievement[], id: number): boolean {
    for (let i = 0; i < ret.length; i++) {
      if (ret[i].id == id) return true;
    }
    return false;
  }
  async addToUser(
    userId: number,
    achievementId: number,
  ): Promise<Achievement | undefined> {
    const userAchivement: any = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        nickname: true,
      },
    });
    if (!userAchivement && !userAchivement.nickname)
      throw new NotFoundException('User not found');
    try {
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          achievement: {
            connect: {
              id: achievementId,
            },
          },
        },
      });
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025')
          throw new NotFoundException('Achivement not found');
      }
    }
    return;
  }
}
