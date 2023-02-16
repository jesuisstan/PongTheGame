import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { TotpService } from 'src/auth/totp/totp.service';
import { SessionUser } from 'src/decorator/session-user.decorator';

@Controller('/auth/totp')
export class TotpController {
  constructor(private readonly totp: TotpService) {}

  @Get('qrcode')
  @UseGuards(IsAuthenticatedGuard)
  async getQrCode(@SessionUser() user: User) {
    console.log(user);

    return this.totp.getQrCode(user.username);
  }
}
