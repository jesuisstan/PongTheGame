import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { giveAchievementService } from 'src/achievement/utils/giveachievement.service';

@Module({
	providers : [giveAchievementService],
	imports: [PrismaModule],
	exports: [giveAchievementService],
})

export class giveAchievementModule {}