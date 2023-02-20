import Prisma from '@prisma/client';

export {};

declare global {
  namespace Express {
    export type User = Pick<Prisma.User, 'id' | 'profileId' | 'provider'>;
  }
}
