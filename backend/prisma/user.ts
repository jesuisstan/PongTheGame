import { User, Prisma } from '@prisma/client';
import { prisma } from './seed';

export async function insert_admin() {
  console.log('Create admin user');
  const admin_user: Prisma.UserCreateInput = {
    username: 'Admin',
    profileId: 'admin',
    provider: 'ADMIN',
    role: 'ADMIN',
  };
  const user: User = await prisma.user.create({ data: admin_user });
  await prisma.stats.create({ data: { userId: user.id } });
  await this.prisma.userAchivement.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      achievement: {
        connect: {
          Title: 'Be Admin',
        },
      },
    },
  });
  console.log(`User ${user.username} create at id: ${user.id}`);
}
