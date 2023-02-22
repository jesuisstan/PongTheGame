import { Injectable } from '@nestjs/common';
import '@nestjs/passport';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsAuthenticatedGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
