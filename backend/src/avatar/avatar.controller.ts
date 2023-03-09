import {
  BadRequestException,
  Controller,
  Delete,
  Logger,
  PayloadTooLargeException,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { FsExceptionInterceptor } from 'src/avatar/filter/fs-exception.interceptor';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

@Controller('/avatar')
export class AvatarController {
  private readonly logger = new Logger(AvatarController.name);

  constructor(private readonly users: UserService) {}

  @Post('/upload')
  @UseGuards(IsAuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req: Request, file, callback) {
        const lengthHeader = req.header('Content-Length');

        if (lengthHeader === undefined) {
          throw new BadRequestException('missing Content-Length header');
        }

        const length = parseInt(lengthHeader);

        if (isNaN(length)) {
          throw new BadRequestException('invalid Content-Length header');
        }

        if (length >= 2e6)
          return callback(
            new PayloadTooLargeException('Maximum file size is 2.0 MB'),
            false,
          );

        const regex = /^image\/(png|jpeg|gif|webp)$/;

        if (regex.test(file.mimetype)) {
          return callback(null, true);
        }

        return callback(
          new UnsupportedMediaTypeException(
            'Accepted file types are png, jpeg, gif, webp',
          ),
          false,
        );

        // if (acceptedMimeTypes.includes(file.))
      },
    }),
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

    const bufferBase64 = file.buffer.toString('base64');
    const base64 = `data:${file.mimetype};base64,${bufferBase64}`;

    return this.users.setAvatar(user, base64);
  }

  @Delete('/')
  @UseGuards(IsAuthenticatedGuard)
  @UseInterceptors(FsExceptionInterceptor)
  @ApiTags('Avatar')
  async deleteAvatar(@SessionUser() user: User) {
    return this.users.setAvatar(user, null);
  }
}
