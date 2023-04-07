import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { SetNicknameDTO } from 'src/user/dto/setNickname.dto';
import { UserService } from 'src/user/user.service';
import { WebsocketsService } from 'src/websockets/websockets.service';

@Controller('/user')
@UseGuards(IsAuthenticatedGuard)
@ApiTags('Users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly users: UserService,
    private readonly websocket: WebsocketsService,
  ) {}

  @Get('/:nickname')
  @ApiOperation({
    summary: 'Find a user by its nickname',
    parameters: [{ name: 'nickame', in: 'path' }],
    responses: {
      '404': {
        description: 'user with such nickname was not found',
      },
    },
  })
  async getUserByNickname(@Param('nickname') nickname: string) {
    const user = await this.users.findUserByNickname(nickname);
    if (user === null || user.nickname == 'AI') throw new NotFoundException();
    this.websocket.modifyTheUserSocket(user.id);
    return user;
  }

  @Patch('/setnickname')
  @ApiOperation({
    summary: "Change a user's nickname",
  })
  @UsePipes(ValidationPipe)
  @ApiBadRequestResponse({
    description:
      'The payload is not formatted well or the nickname does not match SetNicknameDTO conditions',
  })
  @ApiConflictResponse({
    description: 'The nickname is already taken',
  })
  async setNickname(
    @SessionUser() user: User,
    @Body() dto: SetNicknameDTO,
  ): Promise<User> {
    const { nickname } = dto;
    const foundUser = await this.users.findUserByNickname(nickname);

    if (foundUser !== null)
      throw new ConflictException('This nickname is already used');
    return await this.users.setUserNickname(user, nickname);
  }
}
