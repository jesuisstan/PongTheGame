import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Post, Param } from '@nestjs/common';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { User } from '@prisma/client';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/game')
@UseGuards(IsAuthenticatedGuard)
@ApiTags('Game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly prisma: PrismaService,
  ) {}
  @Post('/game/invite/:Nickname')
  async invitePlayer(
    @SessionUser() user: User,
    @Param('Nickname') nickname: string,
  ) {
    const friend_id = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      select: {
        id: true,
      },
    });
    if (!friend_id) return;

    this.gameService.create_friend_game([user.id, friend_id.id]);
  }
}
