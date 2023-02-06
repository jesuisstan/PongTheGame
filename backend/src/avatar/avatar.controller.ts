import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { SessionUser } from 'src/decorator/session-user.decorator';

@Controller('/avatar')
export class AvatarController {
  private readonly logger = new Logger(AvatarController.name);

  @Post('/upload')
  @UseGuards(IsAuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100000000 } }))
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
    @SessionUser() user: Express.User,
  ) {
    if (file === undefined) throw new BadRequestException('no file given');

    const handle = await fs.open(path.join('avatars', user.id.toString()), 'w');

    await handle.write(file.buffer);
    await handle.close();
  }
}
