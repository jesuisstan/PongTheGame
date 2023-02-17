import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { AvatarModule } from 'src/avatar/avatar.module';
import { MatchModule } from 'src/match/match.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatusController } from 'src/status/status.controller';
import { UserModule } from 'src/user/user.module';

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
    AvatarModule,
  ],
  providers: [],
  controllers: [StatusController],
})
export class AppModule {}
