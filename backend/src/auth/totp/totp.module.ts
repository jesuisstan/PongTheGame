import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TotpController } from 'src/auth/totp/totp.controller';
import { TotpService } from 'src/auth/totp/totp.service';

@Module({
  controllers: [TotpController],
  providers: [TotpService],
  imports: [ConfigModule],
})
export class TotpModule {}
