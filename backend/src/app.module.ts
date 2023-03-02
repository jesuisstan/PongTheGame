import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AchivementModule } from 'src/achievement/achievement.module';
import { AuthModule } from 'src/auth/auth.module';
import { AvatarModule } from 'src/avatar/avatar.module';
import { MatchModule } from 'src/match/match.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatusController } from 'src/status/status.controller';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AchivementModule,
    AuthModule,
    UserModule,
    MatchModule,
    PrismaModule,
    ChatModule,
    AvatarModule,
    GameModule,
  ],
  providers: [],
  controllers: [StatusController],
})
export class AppModule {}
