import { Module } from '@nestjs/common';
import { AvatarController } from 'src/avatar/avatar.controller';
import { AvatarService } from 'src/avatar/avatar.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [UserModule],
})
export class AvatarModule {}
