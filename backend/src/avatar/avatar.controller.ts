import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { AvatarService } from 'src/avatar/avatar.service';
import { FsExceptionInterceptor } from 'src/avatar/filter/fs-exception.interceptor';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

@UseGuards(IsAuthenticatedGuard)
@Controller('/avatar')
export class AvatarController {
  private readonly logger = new Logger(AvatarController.name);

  constructor(
    private readonly avatars: AvatarService,
    private readonly users: UserService,
  ) {}

  @Get('/:id')
  @ApiTags('Avatar')
  @ApiOperation({
    summary: "Get a user's avatar",
  })
  @ApiNotFoundResponse({
    description: 'User with such id not found',
  })
  async getAvatar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const user = await this.users.findUserById(id);

    if (user === null) {
      throw new NotFoundException();
    }

    this.logger.debug('User found');
    try {
      res.contentType('image/jpeg');
      const stream = await this.avatars.getAvatarStream(user);
      this.logger.debug('File found');
      return stream.pipe(res);
    } catch {}

    this.logger.debug('File not found');

    if (user.avatar !== null) {
      this.logger.debug('Avatar url set');
      return res.redirect(302, user.avatar);
    }

    this.logger.debug('Avatar url not set');
    throw new NotFoundException(); // TODO return default avatar
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 100000000 } }),
    FsExceptionInterceptor,
  )
  @ApiTags('Avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @UploadedFile('file') file: Express.Multer.File,
    @SessionUser() user: User,
  ) {
    if (file === undefined) throw new BadRequestException('no file given');

    const handle = await this.avatars.openAvatarFile(user, 'w');

    await handle.write(file.buffer);
    await handle.close();

    // set the avatar to null if and only if the operations
    // on the file system were successful
    return this.users.setAvatar(user, null);
  }

  @Delete('/')
  @UseInterceptors(FsExceptionInterceptor)
  @ApiTags('Avatar')
  async deleteAvatar(@SessionUser() user: User) {
    const dbUser = this.users.setAvatar(user, null);

    try {
      this.avatars.deleteAvatar(user);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    return dbUser;
  }
}
