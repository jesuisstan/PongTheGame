import { Injectable } from '@nestjs/common';
import { User, UserAchivement } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class giveAchievementService {
  constructor(private prisma: PrismaService) {}

  async _checkAlreadyGot(
    UserId: number,
    AchievementId: number,
  ): Promise<boolean> {
    const res: UserAchivement[] | null =
      await this.prisma.userAchivement.findMany({
        where: {
          userId: UserId,
          achievementId: AchievementId,
        },
      });
    if (!res) return false;
    return true;
  }

  async fisrtLogin(user: User) {
    if (await this._checkAlreadyGot(user.id, 1)) {
      return;
    }
    await this.prisma.userAchivement.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        achievement: {
          connect: {
            Title: 'First Login',
          },
        },
      },
    });
    this.collector(user);
  }

  async custom(user: User) {
    if (await this._checkAlreadyGot(user.id, 8)) {
      return;
    }
    await this.prisma.userAchivement.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        achievement: {
          connect: {
            Title: 'Change Avatar',
          },
        },
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
      if (await this._checkAlreadyGot(user.id, 2)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'First Game',
            },
          },
        },
      });
    } else if (game.nb_game == 10) {
      if (await this._checkAlreadyGot(user.id, 3)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Play 10 Games',
            },
          },
        },
      });
    } else if (game.nb_game == 42) {
      if (await this._checkAlreadyGot(user.id, 4)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Play 42 Games',
            },
          },
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
      if (await this._checkAlreadyGot(user.id, 5)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Win One Game',
            },
          },
        },
      });
    } else if (game.nb_win == 10) {
      if (await this._checkAlreadyGot(user.id, 6)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: "'Win 10 Games",
            },
          },
        },
      });
    } else if (game.nb_win == 42) {
      if (await this._checkAlreadyGot(user.id, 7)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Win 42 Games',
            },
          },
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
      if (await this._checkAlreadyGot(user.id, 9)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Get One Friend',
            },
          },
        },
      });
    } else if (nb_friends.friends.length == 42) {
      if (await this._checkAlreadyGot(user.id, 10)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'More Friends',
            },
          },
        },
      });
    }
  }

  async collector(user: User) {
    const nb_achievements = await this.prisma.userAchivement.findMany({
      where: {
        userId: user.id,
      },
      select: {
        achievement: true,
      },
    });
    if (nb_achievements.length == 10) {
      if (await this._checkAlreadyGot(user.id, 12)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Achievements everywhere',
            },
          },
        },
      });
    } else if (nb_achievements.length == 20) {
      if (await this._checkAlreadyGot(user.id, 13)) {
        return;
      }
      await this.prisma.userAchivement.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          achievement: {
            connect: {
              Title: 'Achievements everywhere * 2',
            },
          },
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
