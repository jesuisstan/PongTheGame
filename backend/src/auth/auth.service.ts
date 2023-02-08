import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async signToken(id: number): Promise<string> {
    return this.jwt.signAsync({ id });
  }
}
