import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class giveAchievementService {
  constructor(private prisma: PrismaService) {}

  async fisrtLogin(user: User) {
    await this.prisma.achievement.update({
      where: {
        Title: 'First Login',
      },
      data: {
        userId: user.id,
      },
    });
    this.collector(user);
  }

  async custom(user: User) {
    await this.prisma.achievement.update({
      where: {
        Title: 'Change Avatar',
      },
      data: {
        userId: user.id,
      },
    });
    this.collector(user);
  }

  async playGame(user: User) {
    const game = await this.prisma.stats.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        nb_game: true,
      },
    });

    if (!game) return;
    if (game.nb_game == 1) {
      await this.prisma.achievement.update({
        where: {
          Title: 'First Game',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (game.nb_game == 10) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Play 10 Games',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (game.nb_game == 42) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Play 42 Games',
        },
        data: {
          userId: user.id,
        },
      });
    }
  }

  async winGame(user: User) {
    const game = await this.prisma.stats.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        nb_win: true,
      },
    });
    if (!game) return;
    if (game.nb_win == 1) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Win One Game',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (game.nb_win == 10) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Win 10 Games',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (game.nb_win == 42) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Win 42 Games',
        },
        data: {
          userId: user.id,
        },
      });
    }
  }

  async getFriends(user: User) {
    const nb_friends = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        friends: true,
      },
    });
    if (!nb_friends) return;
    if (nb_friends.friends.length == 1) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Get One Friends',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (nb_friends.friends.length == 42) {
      await this.prisma.achievement.update({
        where: {
          Title: 'More Friends',
        },
        data: {
          userId: user.id,
        },
      });
    }
  }

  async collector(user: User) {
    const nb_achievements = await this.prisma.achievement.findMany({
      where: {
        userId: user.id,
      },
    });
    if (nb_achievements.length == 10) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Achievements everywhere',
        },
        data: {
          userId: user.id,
        },
      });
    } else if (nb_achievements.length == 20) {
      await this.prisma.achievement.update({
        where: {
          Title: 'Achievements everywhere * 2',
        },
        data: {
          userId: user.id,
        },
      });
    }
  }
  async getAchievement(user: User | undefined) {
    if (!user) return;
    await this.playGame(user);
    await this.winGame(user);
    await this.getFriends(user);
    await this.collector(user);
  }
}
