import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async UserStats(Nickname: string): Promise<{
    match_play: number;
    match_win: number;
    match_lose: number;
  } | null> {
    const user = await this.prisma.user.findUnique({
      where: { nickname: Nickname },
    });
    if (!user) throw new NotFoundException('User not found');
    const stats: any = await this.prisma.stats.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        nb_game: true,
        nb_win: true,
      },
    });
    if (!stats) throw new NotFoundException('Stats not create'); // Never Used
    return {
      match_play: stats.nb_game,
      match_win: stats.nb_win,
      match_lose: stats.nb_game - stats.nb_win,
    };
  }
}
