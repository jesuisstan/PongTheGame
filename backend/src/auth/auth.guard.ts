import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest<Request>();

		return req.isAuthenticated();
	}
}
