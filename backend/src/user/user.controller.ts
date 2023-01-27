import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly users: UserService) {}

  // https://stackoverflow.com/a/71671007
  @Get('/:id(\\d+)')
  async getUserById(@Param('id') id: string) {
    const user = await this.users.findUserById(parseInt(id));

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
