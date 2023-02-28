import { PrismaClient } from '@prisma/client';
import { insert_achievement } from './achievement';
import { insert_admin } from './user';

export const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log(`Start seeding ...`);
  await insert_achievement();
  await insert_admin();
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
