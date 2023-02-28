import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { CreateMatchDTO } from 'src/match/dto/createMatch.dto';
import { MatchService } from 'src/match/match.service';
import { UserService } from 'src/user/user.service';

@Controller('/match')
@ApiTags('Matches')
export class MatchController {
  constructor(
    private readonly matches: MatchService,
    private readonly users: UserService,
  ) {}

  @Get('/mine')
  @UseGuards(IsAuthenticatedGuard)
  @ApiOperation({
    summary: 'Get the match history for the current user',
  })
  async mine(@SessionUser() user: User) {
    return this.matches.getMatchHistory(user, 0, 50); //TODO change skip/take
  }

  @Get('/:id')
  @UseGuards(IsAuthenticatedGuard)
  @ApiOperation({
    summary: 'Get a match by its id',
  })
  async getMatchById(@Param('id', ParseIntPipe) id: number) {
    const match = await this.matches.getMatchById(id);

    if (match === null) throw new NotFoundException();
    return match;
  }
}
