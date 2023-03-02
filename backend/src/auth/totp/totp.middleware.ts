import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TotpService } from 'src/auth/totp/totp.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TotpMiddleware implements NestMiddleware<Request, Response> {
  private readonly logger = new Logger(TotpMiddleware.name);

  constructor(
    private readonly totp: TotpService,
    private readonly users: UserService,
  ) {}

  async use(req: Request, res: Response, next: (error?: Error) => void) {
    if (req.user === undefined) throw new UnauthorizedException();

    this.logger.debug(req.user);

    const user = await this.users.findUserById(req.user.id);

    this.logger.debug(user);

    if (user === null) throw new UnauthorizedException();

    if (req.session.totpVerified || !(await this.totp.isTotpEnabled(user)))
      return next();

    return res.status(400).json(user).end();

    // return next(new BadRequestException('totp authentication required'));
  }
}