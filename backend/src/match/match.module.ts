import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  providers: [MatchService],
  controllers: [MatchController],
  imports: [PrismaModule, UserModule],
})
export class MatchModule {}
