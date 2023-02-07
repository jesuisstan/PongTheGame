import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [PrismaModule, UserModule],
})
export class MatchModule {}
