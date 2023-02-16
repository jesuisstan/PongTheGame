import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { Config } from 'src/config.interface';

@Injectable()
export class TotpService {
  // https://stackoverflow.com/a/53601060
  private static readonly BASE32_REGEX = /^[A-Z2-7]+=*$/;

  private readonly logger = new Logger(TotpService.name);
  private readonly secret: string;

  constructor(config: ConfigService<Config>) {
    const secret = config.getOrThrow('TOTP_SECRET');
    // const secret = 'AJU3JX7ZIA54EZQ=';

    this.secret = TotpService.checkSecret(secret);
  }

  private static checkSecret(secret: string) {
    if (secret.length % 8 !== 0 || !this.BASE32_REGEX.test(secret)) {
      throw new Error('Invalid secret: ' + secret);
    }
    return secret;
  }

  getQrCode(username: string) {
    return authenticator.keyuri(username, 'ft_transcendence', this.secret);
  }
}
