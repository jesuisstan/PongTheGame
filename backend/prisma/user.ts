import { Prisma } from '@prisma/client';
import { prisma } from './seed';

export async function insert_AI() {
  console.log('Creation AI');
  const AI: Prisma.UserCreateInput = {
    nickname: 'AI',
    username: 'Artificial Integlligence',
    profileId: '2023',
    provider: 'AI',
    role: 'ADMIN',
  };
  await prisma.user.create({
    data: AI,
  });
  console.log(`User ${AI.nickname}`);
}
