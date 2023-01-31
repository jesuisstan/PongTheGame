import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  // https://stackoverflow.com/a/71671007
  @Get('/:id(\\d+)')
  @ApiOperation({
    summary: 'Find a user by its id',
    parameters: [{ name: 'id', in: 'path' }],
    responses: {
      '404': {
        description: 'user with such id was not found',
      },
    },
  })
  async getUserById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
  ) {
    const user = await this.users.findUserById(id);

    if (user === null) throw new NotFoundException();
    return user;
  }

  @Get('/:nickname')
  async getUserByNickname(@Param('nickname') nickname: string) {
    const user = await this.users.findUserByNickname(nickname);

    if (user === null) throw new NotFoundException();
    return user;
  }
}
