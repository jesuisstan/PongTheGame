import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
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
export class MatchController {
  constructor(
    private readonly matches: MatchService,
    private readonly users: UserService,
  ) {}

  @Get('/mine')
  @UseGuards(IsAuthenticatedGuard)
  @ApiTags('Matches')
  @ApiOperation({
    summary: 'Get the match history for the current user',
  })
  async mine(@SessionUser() user: User) {
    return this.matches.getMatchHistory(user, 0, 50); //TODO change skip/take
  }

  @Get('/:id')
  @UseGuards(IsAuthenticatedGuard)
  @ApiTags('Matches')
  @ApiOperation({
    summary: 'Get a match by its id',
  })
  async getMatchById(@Param('id', ParseIntPipe) id: number) {
    const match = await this.matches.getMatchById(id);

    if (match === null) throw new NotFoundException();
    return match;
  }

  @Post('/')
  @UseGuards(IsAuthenticatedGuard)
  @ApiTags('Matches')
  @ApiOperation({
    summary: 'Create a new match that opposes two users',
  })
  async createMatch(@Body(ValidationPipe) body: CreateMatchDTO) {
    const { user1: userId1, user2: userId2 } = body;

    if (userId1 === userId2) {
      throw new BadRequestException('user1 and user2 have the same value');
    }

    const ids = [userId1, userId2];
    const users = await this.users.findUsersById(...ids);
    const notFoundIds = users
      .map((user, index) => {
        if (user === null) return ids[index];
        return null;
      })
      .filter((id) => id !== null);

    if (notFoundIds.length !== 0) {
      return new NotFoundException(notFoundIds);
    }

    return this.matches.createMatch(users[0]!!, users[1]!!);
  }
}
