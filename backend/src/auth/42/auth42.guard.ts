import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

export class Auth42Guard extends AuthGuard('42') {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(ctx);
    const req: Request = ctx.switchToHttp().getRequest();

    await super.logIn(req);

    if (typeof activate === 'boolean') {
      return activate;
    }

    return firstValueFrom(activate);
  }
}
