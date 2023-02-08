import { Injectable } from '@nestjs/common';
import { Match, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a match with its entries for two users
   *
   * @param user1 the first user
   * @param user2 the second user
   * @return the newly created match
   */
  async createMatch(user1: User, user2: User): Promise<Match> {
    return this.prisma.match.create({
      data: {
        state: 'Scheduled',
        startDate: new Date(),
        entries: {
          create: [
            {
              userId: user1.id,
              score: 0,
            },
            {
              userId: user2.id,
              score: 0,
            },
          ],
        },
      },
    });
  }

  /**
   * Get a match by its id
   *
   * @param matchId the id of the match
   * @return the match associated to the given id
   */
  async getMatchById(matchId: number): Promise<Match | null> {
    return this.prisma.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        entries: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Get a match history for a given user
   *
   * @param user the user to get the match history from
   * @param skip the number of matches to skip (for pagination)
   * @param take the number of matches to take (for pagination)
   * @return an array containing at most `take` matches
   */
  async getMatchHistory(
    user: User,
    skip: number,
    take: number,
  ): Promise<Match[]> {
    console.log('before');

    const matches = await this.prisma.match.findMany({
      where: {
        entries: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        entries: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
      distinct: 'id',
      take,
      skip,
    });

    console.log('after');
    return matches;
  }
}
