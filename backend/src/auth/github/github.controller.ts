import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GithubGuard } from 'src/auth/github/github.guard';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/github')
export class GithubController {
  @Get('/')
  @UseGuards(GithubGuard)
  async login() {
    return 'hello';
  }

  @Get('/callback')
  @UseGuards(GithubGuard)
  async callback(@Res() res: Response) {
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
