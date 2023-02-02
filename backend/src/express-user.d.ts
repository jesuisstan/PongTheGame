import Prisma from '@prisma/client';

export {};

declare global {
  namespace Express {
    export interface User
      extends Pick<Prisma.User, 'id' | 'profileId' | 'provider'> {}
  }
}
