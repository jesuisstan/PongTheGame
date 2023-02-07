import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AchivementModule } from './achievement/achievement.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { PrismaModule } from './prisma/prisma.module';
import { StatusController } from './status/status.controller';
import { UserModule } from './user/user.module';

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
  ],
  providers: [],
  controllers: [StatusController],
})
export class AppModule {}
