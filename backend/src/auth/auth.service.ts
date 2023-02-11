import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService, private config: ConfigService) {};

  async signToken(id: number): Promise<{access_token: string}> {
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync({id: id}, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token : token,
    }
  }
}
