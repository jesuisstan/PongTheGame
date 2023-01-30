import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Auth42Guard } from 'src/auth/42/auth42.guard';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/42')
export class Auth42Controller {
  @Get('/')
  @UseGuards(Auth42Guard)
  async login() {
    // never reached
  }

  @Get('/callback')
  @UseGuards(Auth42Guard)
  async callback(@Res() res: Response) {
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
