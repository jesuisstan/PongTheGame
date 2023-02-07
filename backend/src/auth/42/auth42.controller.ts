import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth42Guard } from './auth42.guard';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/42')
@ApiTags('Authentication/42')
export class Auth42Controller {
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
  async callback(@Res() res: Response) {
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
