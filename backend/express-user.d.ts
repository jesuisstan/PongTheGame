import Prisma from '@prisma/client';

declare global {
  namespace Express {
    export type User = Pick<Prisma.User, 'id' | 'profileId' | 'provider'>;
  }
}
