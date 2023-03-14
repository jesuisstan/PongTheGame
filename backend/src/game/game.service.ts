import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class GameService {
  private readonly user: User[] = [];
  private game_queue = [];
  games = [];
  private invitation: number[] = [];

  // match_create(user: User){
  //     if (this.user.length == 0){
  //         this.user[0] = user;
  //         return "Waiting screen"; // TODO NEED TO ADD A CANCEL BUTTON
  //     }
  //     // console.log(this.user[0]);
  // }
}
