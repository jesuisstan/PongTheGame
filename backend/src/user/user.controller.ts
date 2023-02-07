import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from '../auth/auth.guard';
import { SessionUser } from '../decorator/session-user.decorator';
import { SetNicknameDTO } from '../user/dto/setNickname.dto';
import { UserService } from '../user/user.service';

@Controller('/user')
@ApiTags('Users')
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
  // @ApiTags('Users')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.users.findUserById(id);

    if (user === null) throw new NotFoundException();
    return user;
  }

  @Patch('/setnickname')
  @ApiOperation({
    summary: "Change a user's nickname",
  })
  @UseGuards(IsAuthenticatedGuard)
  @UsePipes(ValidationPipe)
  async setNickname(@SessionUser() user: User, @Body() dto: SetNicknameDTO) {
    const { nickname } = dto;

    return await this.users.setUserNickname(user, nickname);
  }
}
