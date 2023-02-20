import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AvatarService {
  getAvatarFilePath(user: Express.User): string {
    return path.join('avatars', `${user.id}.jpg`);
  }

  async openAvatarFile(
    user: Express.User,
    mode: string,
  ): Promise<fs.FileHandle> {
    return fs.open(this.getAvatarFilePath(user), mode);
  }

  async readAvatar(user: Express.User): Promise<Buffer> {
    const handle = await this.openAvatarFile(user, 'r');
    const buffer = await handle.readFile();
    handle.close();
    return buffer;
  }

  async getAvatarStream(user: Express.User) {
    return createReadStream(this.getAvatarFilePath(user));
  }

  async deleteAvatar(user: Express.User): Promise<void> {
    return fs.unlink(this.getAvatarFilePath(user));
  }
}
