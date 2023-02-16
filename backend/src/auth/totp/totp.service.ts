import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TotpService {
  private static readonly issuerName = 'ft_transcendence';
  private readonly logger = new Logger(TotpService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a new secret
   *
   * @param bytes the size in bytes of the secret
   * @returns the generated secret
   */
  generateSecret(bytes: number): string {
    return authenticator.generateSecret(bytes);
  }

  /**
   * Generate an url for google authenticator (otpauth://...)
   *
   * @param user the user for whom the url will be generated
   * @returns an url if the user has totp enabled, null otherwise
   */
  async getTotpUrl(user: User): Promise<string | null> {
    const { id: userId } = user;

    const totpSecret = await this.prisma.totpSecret.findUnique({
      where: {
        userId,
      },
      select: {
        secret: true,
      },
    });

    if (totpSecret === null) {
      return null;
    }

    return authenticator.keyuri(
      user.username,
      TotpService.issuerName,
      totpSecret.secret,
    );
  }
}
