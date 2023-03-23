import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles: Role = 'ADMIN';
    if (!requiredRoles) {
      return true;
    }
    const user = ctx.switchToHttp().getRequest().user;
    if (user.role == requiredRoles) return true;
    return false;
  }
}
