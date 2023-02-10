import { Module } from '@nestjs/common';
import { AvatarController } from 'src/avatar/avatar.controller';
import { AvatarService } from 'src/avatar/avatar.service';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
})
export class AvatarModule {}
