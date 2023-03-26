import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';
@Injectable()
export class FriendService {
  constructor(
    private readonly websocket: WebsocketsService,
    private readonly prisma: PrismaService,
    private readonly achievement: giveAchievementService,
  ) {}

  private _sendable_friend(socket: any) {
    const res = {
      id: socket.user.id,
      avatar: socket.user.avatar,
      nickname: socket.user.nickname,
    };
    return res;
  }

  async addFriend(socket: any, payload: any) {
    // Check he composition of the payload
    const Friend = await this.prisma.user.findUnique({
      where: {
        nickname: payload.nickname,
      },
    });
    if (!Friend) {
      this.websocket.send(socket, 'error_friend', {
        status: 'error',
        error: 'Friend not found',
      });
      return;
    }
    await this.prisma.user.update({
      where: {
        id: socket.user.id,
      },
      data: {
        friends: {
          create: [
            {
              friendId: payload.id,
            },
          ],
        },
      },
    });
    const friend_socket = this.websocket.getSockets([Friend.id]);
    if (!friend_socket) {
      this.websocket.send(socket, 'error_friend', {
        status: 'error',
        error: 'Friend not connected',
      });
      return;
    }
    const res = this._sendable_friend(socket);
    this.websocket.send(friend_socket, 'friend_request', res);
  }

  async cancelRequest(socket: any, payload: any) {
    // const user_send : User[] = await this.prisma.user.findMany({ // Dont need this if the user who send the request is send in payload
    //     where : {
    //         friends :
    //         [
    //             {
    //                 userId : socket.user.id,
    //                 status : "PENDING",
    //             }
    //         ]
    //     },
    // });
    // await this.prisma.user.delete({ // NEED TO DELETE THE FRIENDS INVITE IN BACKEND
    //     where : {
    //         id : user_send[0].id,
    //         friends :
    //         [{
    //             userId : socket.user.id,
    //             status : "PENDING",
    //         }]
    //     }
    // });
    // const send_socket : Socket[] = this.websocket.getSockets([user_send[0].id, socket.user.id]);
    // this.websocket.send(send_socket[0], "cancel_request", {}); // TODO check if data is needed in the front
    // this.websocket.send(send_socket[1], "cancel_request", {});// TODO check if data is needed in the front
  }
}
