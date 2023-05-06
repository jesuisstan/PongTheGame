import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Body,
  ParseIntPipe,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { FriendDto } from './dto/friends.dto';
import { FriendService } from './friends.service';

@Controller('/friend')
@ApiTags('Friends')
@UseGuards(IsAuthenticatedGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all friends',
    parameters: [{ name: 'nickname', in: 'query' }],
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async getFriendsByNickname(@SessionUser() user: User) {
    return this.friendsService.getAllFriendsFromUser(user);
  }

  @Get(':nickname')
  @ApiOperation({
    summary: 'Get friends by is nickname',
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async getFriends(@Param('nickname') nickname: string) {
    return this.friendsService.getFriendsFromNickname(nickname);
  }

  @Post('add/:id')
  @ApiOperation({
    summary: 'Add friends',
    parameters: [{ name: 'id', in: 'query' }],
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async addFriendsNickname(
    @SessionUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.friendsService.addFriendsById(user, id);
  }

  @Post('add')
  @ApiOperation({
    summary: 'Add friends',
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async addFriend(@SessionUser() user: User, @Body() addFriendDto: FriendDto) {
    this.friendsService.addFriendsByNickname(user, addFriendDto.nickname);
  }

  @Post('remove/:id')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Remove friends',
    parameters: [{ name: 'id', in: 'query' }],
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async removeFriendByid(
    @SessionUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.friendsService.removeFriendsById(user, id);
  }

  @Patch('remove')
  @ApiOperation({
    summary: 'Remove friends',
  })
  @ApiResponse({ status: 401, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 200, description: 'Succes' })
  async removeFriend(
    @SessionUser() user: User,
    @Body() removeFriendDto: FriendDto,
  ) {
    this.friendsService.removeFriendsByNickname(user, removeFriendDto.nickname);
  }
}
