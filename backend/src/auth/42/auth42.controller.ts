import {
  Controller,
  Get,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { Auth42Guard } from 'src/auth/42/auth42.guard';
import { AuthService } from 'src/auth/auth.service';
import { Config } from 'src/config.interface';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { convertTime } from 'src/utils/time';

@Controller('/auth/42')
@ApiTags('Authentication/42')
export class Auth42Controller {
  private readonly frontendUrl;

  constructor(
    private readonly auth: AuthService,
    private readonly give: giveAchievementService,
    config: ConfigService<Config>,
  ) {
    this.frontendUrl = config.getOrThrow('FRONTEND_URL');
  }

  @Get('/')
  @ApiOperation({ summary: 'Connect using the 42 OAuth2 API' })
  @UseGuards(Auth42Guard)
  async login() {
    // never reached
  }

  @Get('/callback')
  @ApiOperation({
    summary: 'Authenticate with the 42 OAuth2 API',
    parameters: [
      {
        name: 'code',
        in: 'query',
      },
    ],
  })
  @UseGuards(Auth42Guard)
  async callback(@SessionUser() user: User, @Res() res: Response) {
    if (user === undefined) throw new UnauthorizedException();
    await this.give.fisrtLogin(user);
    const token = await this.auth.signToken(user.id);

    res.cookie('access_token', token, {
      maxAge: convertTime({
        days: 30,
      }),
    });

    return res.redirect(`${this.frontendUrl}/profile`);
  }
}
