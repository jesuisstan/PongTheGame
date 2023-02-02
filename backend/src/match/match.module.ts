import { Module } from '@nestjs/common';
import { MatchController } from 'src/match/match.controller';
import { MatchService } from 'src/match/match.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [PrismaModule, UserModule],
})
export class MatchModule {}
