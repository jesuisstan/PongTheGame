import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    console.log("hello world");
    
    return req.isAuthenticated();
  }
}
