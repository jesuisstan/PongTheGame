import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AchievementService],
  controllers: [AchievementController],
  imports: [PrismaModule],
})
export class AchivementModule {}
