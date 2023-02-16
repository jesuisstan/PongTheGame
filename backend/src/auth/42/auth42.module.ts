import { forwardRef, Module } from '@nestjs/common';
import { giveAchievementModule } from 'src/achievement/utils/giveachievement.module';
import { Auth42Controller } from 'src/auth/42/auth42.controller';
import { Auth42Strategy } from 'src/auth/42/auth42.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/auth/session/session.module';

@Module({
  controllers: [Auth42Controller],
  providers: [Auth42Strategy],
  imports: [SessionModule, forwardRef(() => AuthModule), giveAchievementModule],
})
export class Auth42Module {}
