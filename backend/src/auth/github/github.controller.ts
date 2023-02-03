import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GithubGuard } from 'src/auth/github/github.guard';

// TODO use config
const CLIENT_URL = 'http://localhost:3000';

@Controller('/auth/github')
@ApiTags('Authentication/Github')
export class GithubController {
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
  async callback(@Res() res: Response) {
    return res.redirect(`${CLIENT_URL}/profile`);
  }
}
