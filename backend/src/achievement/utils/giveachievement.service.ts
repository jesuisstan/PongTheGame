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
    // TODO add this in the right request
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

  // async playGame(user : User){
  // 	const nb_game = 0; //= await // TODO get nb game played

  // 	if (nb_game == 1)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "First Game",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // 	else if (nb_game == 10)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Play 10 Games",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // 	else if (nb_game == 100)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Play 100 Games",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // }

  // async winGame(user : User){
  // 	const gameWin = 0;//= await ;// TODO do the request

  // 	if (gameWin == 1)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Win One Games",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // 	else if (gameWin == 10)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Win 10 Games",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // 	else if (gameWin == 100)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Win 100 Games",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // }

  // async getFriends(user : User){
  // 	const nb_friends = 0;// TODO do the request
  // 	if (nb_friends == 1)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Get One Friends",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // 	else if (nb_friends == 42)
  // 	{
  // 		await this.prisma.achievement.update({
  // 			where : {
  // 				Title : "Get 42 Friends",
  // 			},
  // 			data : {
  // 				userId : user.id,
  // 			},
  // 		});
  // 	}
  // }

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
  getAchievement(user: User) {
    // playGame(user);
    // winGame(user);
    // getFriends(user);
    this.collector(user);
  }
}
