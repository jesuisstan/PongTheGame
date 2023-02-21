import { PrismaClient } from '@prisma/client';
import { insert_achievement } from './achievement';

export const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  const size : number = (await prisma.achievement.findMany({
    select :{
      id :true,
    },
  })).length;
  if (size == 0)
  {
    console.log(`Start seeding ...`);
    insert_achievement();
    console.log(`Seeding finished.`);
  } else {
    console.log(`Seed not needed.`);
  }
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