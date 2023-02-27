import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Logger,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { IsAuthenticatedGuard } from 'src/auth/auth.guard';
import { VerifyTokenDTO } from 'src/auth/totp/dto/verifyToken.dto';
import { TotpService } from 'src/auth/totp/totp.service';
import { SessionUser } from 'src/decorator/session-user.decorator';
import { UserService } from 'src/user/user.service';

@Controller('/auth/totp')
export class TotpController {
  private readonly logger = new Logger(TotpController.name);

  constructor(
    private readonly totp: TotpService,
    private readonly users: UserService,
  ) {}

  @Post('/')
  @UseGuards(IsAuthenticatedGuard)
  @ApiTags('Authentication/TOTP')
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
  @ApiTags('Authentication/TOTP')
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

  @Post('/verify')
  @UseGuards(IsAuthenticatedGuard)
  @ApiTags('Authentication/TOTP')
  // @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Verify a token and activate the secret for the current user',
  })
  @ApiOkResponse({
    description: 'The supplied code has been validated ',
  })
  @ApiBadRequestResponse({
    description: 'The supplied code was invalid',
  })
  @ApiNotFoundResponse({
    description: 'TOTP was not enabled for this user',
  })
  async verifyToken(
    @SessionUser() user: User,
    @Body() dto: VerifyTokenDTO,
    @Res() res: Response,
  ) {
    const isValid = await this.totp.verifyToken(user, dto.token);

    this.logger.debug(dto);

    if (isValid === null) throw new NotFoundException('totp is not enabled');
    if (!isValid) throw new BadRequestException('invalid code');

    this.totp.enableTotp(user);

    res.status(200).send();
  }
}
