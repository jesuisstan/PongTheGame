import {
  Controller,
  Get,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';
import { GithubGuard } from 'src/auth/github/github.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/github')
@ApiTags('Authentication/Github')
export class GithubController {
  constructor(
    // private readonly auth: AuthService,
    private give: giveAchievementService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Connect using the Github OAuth2 API' })
  @UseGuards(GithubGuard)
  async login() {
    return 'hello';
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
  @UseGuards(GithubGuard)
  async callback(@SessionUser() user: User, @Res() res: Response) {
    this.give.fisrtLogin(user);
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
