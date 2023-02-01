import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const SessionUser = createParamDecorator(function (
  data: undefined,
  ctx: ExecutionContext,
) {
  const req: Request = ctx.switchToHttp().getRequest();

  return req.user;
});
