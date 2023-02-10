import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AvatarService {
  async openAvatarFile(user: Express.User) {
    return fs.open(path.join('avatars', `${user.id}.jpg`), 'w');
  }
}
