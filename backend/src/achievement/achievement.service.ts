import { NotFoundException, BadRequestException, Injectable } from '@nestjs/common';
import { Achievement } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementDTO } from 'src/achievement/dto/achievement.dto';

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
          throw new NotFoundException('Achievement not found'); // TODO modif not a forbidden exepction
      }
    }
    return;
  }

  async userAchievement(id: number): Promise<{ achievement: Achievement[] }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        achievement: true,
      },
    });
    if (!user) throw new NotFoundException('User not found'); // TODO modif not a forbidden exepction
    return user;
  }

  async addToUser(
    userId: number,
    achievementId: number,
  ): Promise<Achievement | undefined> {
    const userAchivement = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        achievement: true,
      },
    });
    if (!userAchivement) throw new NotFoundException('User not found'); // TODO modif not a forbidden exepction
    const achievement: any = userAchivement.achievement.find(
      (Achievement) => Achievement.id == achievementId,
    );
    if (!achievement) throw new ForbiddenException('Achievement not found');
    if (achievement.Title)
      throw new BadRequestException(
        `User already got the achivement '${achievement.Title}'`,
      ); // TODO modif not a forbidden exepction

    try {
      const achievement: Achievement = await this.prisma.achievement.update({
        where: {
          id: achievementId,
        },
        data: {
          userId: userId,
        },
      });
      return achievement;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2025')
          throw new NotFoundException('Achivement not found'); // TODO modif not a forbidden exepction
      }
    }
    return;
  }
}
