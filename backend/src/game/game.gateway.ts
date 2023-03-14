import { Controller, Req } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { User } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
@Controller('game')
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService,
              private prisma: PrismaService) {
              }

  @SubscribeMessage('matchmaking')
  async matchmaking(socket: any, payload: any) {
    if (!payload || !payload.action) return;
    switch (payload.action) {
      case 'join':
        this.gameService.joinQueue(socket, payload.type);
        break;
      case 'cancel':
        this.gameService.cancelQueue(socket);
        break;
      case 'leave':
        this.gameService.leaveGame(socket);
        break;
    }
  }

  // @SubscribeMessage('match_create')
  // async match_create() {// Have to wait 2 user rdy
    
  //   console.log("Je veux creer un match");
  //   // this.gameService.match_create(user);
  //   // await this.prisma.
  // }

  // @SubscribeMessage('match_join')
  // match_join(){

  // }

  // @SubscribeMessage('match_update')
  // match_update(){

  // }

  // @SubscribeMessage('match_view')
  // match_view(){

  // }

//   @SubscribeMessage('resetBall')
//   resetBall() {
//     if (score.player1 >= winScore || score.player2 >= winScore) {
//       gotWinner = true;
//       score.player1 > score.player2
//         ? setWinner(user.nickname)
//         : setWinner('Opponent'); // todo change 'opponent' name
//       setOpen(true);
//     }
//     ballSpeed.X =
//       ballSpeed.X > 0 ? -DEFAULT_BALL_SPEED_X : DEFAULT_BALL_SPEED_X;
//     ballSpeed.Y =
//       ballSpeed.Y > 0 ? -DEFAULT_BALL_SPEED_Y : DEFAULT_BALL_SPEED_Y;
//     ballPosition.X = CANVAS_WIDTH / 2;
//     ballPosition.Y = CANVAS_HEIGHT / 2;
//   }
}
