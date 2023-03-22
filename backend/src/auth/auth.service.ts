import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Config } from 'src/config.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private config: ConfigService<Config>,
  ) {}

  async signToken(id: number): Promise<string> {
    const secret = this.config.getOrThrow('JWT_SECRET');

    const token = await this.jwt.signAsync(
      { id: id },
      {
        expiresIn: '1h',
        secret: secret,
      },
    );
    return token;
  }
}
