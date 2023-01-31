import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth')
export class AuthController {
  @Get('logout')
  @ApiTags('Authentication')
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
    return res.clearCookie('connect.sid').redirect(`${CLIENT_URL}/login`);
  }

  @Get('getuser')
  @ApiTags('Authentication')
  @ApiOkResponse()
  @ApiOperation({ summary: "Returns the current user's data" })
  @ApiResponse({
    status: 401,
    description: 'The user was not connected',
  })
  @UseGuards(AuthGuard)
  async profile(@Req() req: Request) {
    if (req.user !== undefined) return req.user;
    throw new UnauthorizedException();
  }
}
