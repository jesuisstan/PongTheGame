import { Module } from '@nestjs/common';
import { AvatarController } from 'src/avatar/avatar.controller';

@Module({
  controllers: [AvatarController],
})
export class AvatarModule {}
