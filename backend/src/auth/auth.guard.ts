import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class IsAuthenticatedGuard extends AuthGuard('jwt') {
  constructor(){
    super();
  }
}

// export class IsAuthenticatedGuard implements CanActivate {
//   async canActivate(context: ExecutionContext) {
//     const req = context.switchToHttp().getRequest<Request>();
//     return req.isAuthenticated();
//   }
// }
