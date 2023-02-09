import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { giveAchievementService } from './giveachievement.service';

@Module({
	providers : [giveAchievementService],
	imports: [PrismaModule],
})

export class giveAchievementModule {}