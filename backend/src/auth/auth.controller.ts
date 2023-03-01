import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly users: UserService) {}

  @Get('logout')
  @ApiOperation({
    summary:
      "Destroy (invalidate) the current user's session, remove the session cookie and redirect to {frontend}/login",
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>(function (resolve, reject) {
      req.session.destroy(function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
    return res.clearCookie('access_token').redirect(`${CLIENT_URL}/login`);
  }

  @Get('getuser')
  @ApiOperation({ summary: "Returns the current user's data" })
  @UseGuards(IsAuthenticatedGuard)
  @ApiBadRequestResponse({
    description:
      'The user has two-step authentication enabled and the session was not verified',
  })
  async profile(@SessionUser() user: User) {
    return this.users.findUserById(user.id);
  }
}
