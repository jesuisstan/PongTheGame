import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatusController } from 'src/status/status.controller';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MatchModule,
    PrismaModule,
    ChatModule,
  ],
  controllers: [StatusController],
})
export class AppModule {}
