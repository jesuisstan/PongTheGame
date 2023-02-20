import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { SetNicknameDTO } from 'src/user/dto/setNickname.dto';
import { UserService } from 'src/user/user.service';

@Controller('/user')
@ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

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
  @ApiBadRequestResponse({
    description:
      'The username is already taken, or the payload is not formatted well',
  })
  async setNickname(
    @SessionUser() user: User,
    @Body() dto: SetNicknameDTO,
  ): Promise<User> {
    const { nickname } = dto;
    const foundUser = await this.users.findUserByNickname(nickname);

    if (foundUser !== null)
      throw new BadRequestException('This nickname is already used');
    return await this.users.setUserNickname(user, nickname);
  }
}
