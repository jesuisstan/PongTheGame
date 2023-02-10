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
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { AvatarService } from 'src/avatar/avatar.service';
import { SessionUser } from 'src/decorator/session-user.decorator';

@Controller('/avatar')
export class AvatarController {
  private readonly logger = new Logger(AvatarController.name);

  constructor(private readonly avatars: AvatarService) {}

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

    const handle = await this.avatars.openAvatarFile(user);

    await handle.write(file.buffer);
    await handle.close();
  }
}
