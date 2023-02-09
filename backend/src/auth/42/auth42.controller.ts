import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth42Guard } from 'src/auth/42/auth42.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/42')
@ApiTags('Authentication/42')
export class Auth42Controller {
  constructor(private give : giveAchievementService) {}

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
  async callback(@SessionUser() user : Express.User, @Res() res: Response) {
    this.give.fisrtLogin(user);
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
