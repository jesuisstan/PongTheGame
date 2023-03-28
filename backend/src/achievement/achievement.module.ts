import { Module } from '@nestjs/common';
import { AchievementService } from 'src/achievement/achievement.service';
import { AchievementController } from 'src/achievement/achievement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AchievementService],
  controllers: [AchievementController],
  imports: [PrismaModule],
  exports: [AchievementService],
})
export class AchivementModule {}
