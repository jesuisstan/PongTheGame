import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchService } from './match.service';

@Module({
  providers: [MatchService],
  imports: [PrismaModule],
})
export class MatchModule {}
