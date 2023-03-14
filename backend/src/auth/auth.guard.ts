import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsAuthenticatedGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
