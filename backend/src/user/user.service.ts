import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        avatar: true,
        id: true,
        intraUser: true,
        nickname: true,
      },
    });
  }

  async findUserByNickname(nickname: string) {
    return this.prisma.user.findUnique({
      where: { nickname },
      select: {
        avatar: true,
        id: true,
        intraUser: true,
        nickname: true,
      },
    });
  }

  async findUserByIntraId(id: number) {
    const intraUser = await this.prisma.intraUser.findUnique({
      where: { intraId: id },
      select: {
        intraId: true,
        login: true,
        user: {
          include: { intraUser: true },
        },
      },
    });

    return intraUser?.user ?? null;
  }
}
