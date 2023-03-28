import { Module } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { FriendsController } from './friends.controller';
import { FriendService } from './friends.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendService],
  imports: [PrismaModule, WebsocketsModule, giveAchievementModule],
})
export class FriendsModule {}
