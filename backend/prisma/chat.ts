import {Prisma} from '@prisma/client';
import {prisma} from './seed';

export async function insert_General() {
  console.log('Creation chan General');
  const General: Prisma.ChatRoomCreateInput = {
    name: 'General',
    owner: 1,
    modes: '',
    password: '',
    userLimit: 0,
  };
  const VIP: Prisma.ChatRoomCreateInput = {
    name: 'VIP',
    owner: 1,
    modes: 'p',
    password: "TopSecret",
    userLimit: 0,
  };
  await prisma.chatRoom.create({
    data: General,
  });
  await prisma.chatRoom.create({
    data: VIP,
  });
  console.log(`Chat ${General.name}`);
  console.log(`Chat ${VIP.name}`);
}