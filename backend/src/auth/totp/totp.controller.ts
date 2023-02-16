import {
  ConflictException,
  Controller,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiConflictResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { TotpService } from 'src/auth/totp/totp.service';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

@Controller('/auth/totp')
export class TotpController {
  constructor(
    private readonly totp: TotpService,
    private readonly users: UserService,
  ) {}

  @Post('/')
  @UseGuards(IsAuthenticatedGuard)
  @ApiOperation({
    summary: 'Enable TOTP for the current user',
  })
  @ApiConflictResponse({
    description: 'the user already has OTP set',
  })
  async enableTotp(@SessionUser() user: User) {
    if (await this.users.hasTotpSecret(user)) {
      throw new ConflictException('OTP already set');
    }

    const secret = this.totp.generateSecret(128);
    const updatedUser = await this.users.setTotpSecret(user, secret);
    const uri = this.totp.getTotpUrl(updatedUser);

    return uri;
  }

  @Delete('/')
  @UseGuards(IsAuthenticatedGuard)
  @ApiOperation({
    summary: 'Disable TOTP for the current user',
  })
  @ApiConflictResponse({
    description: 'the user does not have OTP set',
  })
  async disableTotp(@SessionUser() user: User) {
    if (!(await this.users.hasTotpSecret(user))) {
      throw new ConflictException('OTP not set');
    }

    return this.users.removeTotpSecret(user);
  }
}
