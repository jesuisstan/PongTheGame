import { Module } from '@nestjs/common';
import { AvatarController } from 'src/avatar/avatar.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AvatarController],
  providers: [],
  imports: [UserModule],
})
export class AvatarModule {}
