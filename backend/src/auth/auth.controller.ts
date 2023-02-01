import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth')
export class AuthController {
  constructor(private readonly users: UserService) {}

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>(function (resolve, reject) {
      req.session.destroy(function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
    return res.clearCookie('connect.sid').redirect(`${CLIENT_URL}/login`);
  }

  @Get('getuser')
  @UseGuards(IsAuthenticatedGuard)
  async profile(@SessionUser() user: User) {
    return this.users.findUserById(user.id);
  }
}
