import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AchievementService } from 'src/achievement/achievement.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { Game } from './game.class';

@Injectable()
export class GameService {
  private readonly user: User[] = [];
  private game_queue = [];
  games: Game[] = [];
  private invitation: number[] = [];

  constructor(
    private readonly websocket: WebsocketsService,
    private readonly prisma: PrismaService,
    private readonly achievement: AchievementService,
  ) {}

  test() {
    // MEMO Need to finish this before testing
    const game = new Game(
      { socket: player1, user: player1.user },
      { socket: player2, user: player2.user },
      this.websocketsService,
      this.prismaService,
      this.achievementsService,
      type,
    );
    game.start(() => {
      console.log('end');
    });
  }
  // match_create(user: User){
  //     if (this.user.length == 0){
  //         this.user[0] = user;
  //         return "Waiting screen"; // TODO NEED TO ADD A CANCEL BUTTON
  //     }
  //     // console.log(this.user[0]);
  // }
}
