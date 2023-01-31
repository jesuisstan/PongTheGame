import Prisma from '@prisma/client';

export {};

declare global {
  namespace Express {
    export interface User extends Prisma.User {}
  }
}
