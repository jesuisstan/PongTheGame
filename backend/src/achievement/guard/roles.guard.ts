import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

// MEMO Expection filter dans le catch mettre les exceptions qui doit filtre
// MEMO Queryfailed error
@Injectable()
export class RolesGuard implements CanActivate {
  constructor() {}

  canActivate(ctx: ExecutionContext): boolean {
	const requiredRoles : Role = 'ADMIN'
	if (!requiredRoles) {
		return true;
	}
	const user = ctx.switchToHttp().getRequest().user;
	if (user.role == requiredRoles)
		return true;
	return false;
	}
}