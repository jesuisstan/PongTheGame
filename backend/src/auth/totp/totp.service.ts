import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TotpSecret, User } from '@prisma/client';
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
   * Generate an url for google authenticator (`otpauth://<...>`)
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

  async verifyToken(user: User, token: string): Promise<boolean | null> {
    const dbSecret = await this.prisma.totpSecret.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        secret: true,
      },
    });

    if (dbSecret === null) {
      return null;
    }

    return authenticator.verify({
      secret: dbSecret.secret,
      token,
    });
  }

  async enableTotp(user: User): Promise<void> {
    const dbSecret = await this.prisma.totpSecret.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        verified: true,
      },
    });

    if (dbSecret === null) throw new NotFoundException('no totp secret');
    if (dbSecret.verified) throw new ConflictException('totp already enabled');

    await this.prisma.totpSecret.update({
      where: {
        id: dbSecret.id,
      },
      data: {
        verified: true,
      },
    });
  }

  async getSecret(user: User): Promise<TotpSecret | null> {
    return this.prisma.totpSecret.findUnique({
      where: {
        userId: user.id,
      },
    });
  }

  async isTotpEnabled(user: User): Promise<boolean> {
    const secret = await this.getSecret(user);

    return secret?.verified ?? false;
  }
}
